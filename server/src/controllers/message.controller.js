import prisma from "../dbConfig/db.js";
import fetch from "node-fetch";

const getMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const chatId = req.params.id;
    if (!chatId) {
      return res.status(404).json({
        message: "ChatId not found",
        success: false,
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId,
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!messages) {
      return res.status(500).json({
        message: "Messages not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Messages fetched successfully",
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};



const abortControllers = {};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
  

    const chatId = req.params.id;
    if (!chatId) {
      return res.status(404).json({
        message: "ChatId not found",
        success: false,
      });
    }

    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
        success: false,
      });
    }

    // Save user message first
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        userId,
        role: "user",
        content: prompt,
      },
    });

    // Update chat title if it's the first message
    const messageCount = await prisma.message.count({
      where: { chatId }
    });
    
    if (messageCount === 1) {
      const title = prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt;
      console.log('📝 Updating chat title:', title);
      await prisma.chat.update({
        where: { id: chatId },
        data: { title }
      });
    }

    // Set up abort controller
    const controller = new AbortController();
    abortControllers[chatId] = controller;
    

    // Set up streaming headers
  
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    let assistantMessage = "";

    try {      
      const ollamaPayload = {
        model: "gemma3:1b", // Fixed: Changed back to the correct model name
        prompt,
        stream: true,
      };

      const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify(ollamaPayload),
      });


      if (!ollamaResponse.ok) {
        const errorText = await ollamaResponse.text();
        
        res.write('Sorry, I encountered an error connecting to the AI service. Please try again.');
        res.end();
        delete abortControllers[chatId];
        return;
      }

      let chunkCount = 0;
      let buffer = '';

      // Use async iterator for Node.js streams
      for await (const chunk of ollamaResponse.body) {
        chunkCount++;
        const chunkStr = chunk.toString();
        buffer += chunkStr;
        
        // Process complete lines from buffer
        const lines = buffer.split('\n');
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          
          // Skip lines that don't look like JSON
          if (!line.startsWith('{')) {
            continue;
          }
          
          try {
            const data = JSON.parse(line);        
            if (data.response) {
              assistantMessage += data.response;
              res.write(data.response);
            }
            
            if (data.done) {
              // Save assistant response to database
              const savedMessage = await prisma.message.create({
                data: {
                  chatId,
                  role: 'assistant',
                  content: assistantMessage
                }
              });

              res.end();
              delete abortControllers[chatId];
              return;
            }

            if (data.error) {
              res.write(`\n\nError: ${data.error}`);
              res.end();
              delete abortControllers[chatId];
              return;
            }

          } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            console.error('Failed to parse line:', line);
            // Continue with next line instead of breaking
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        console.log('📝 Processing remaining buffer:', buffer);
        try {
          const data = JSON.parse(buffer.trim());
          if (data.response) {
            assistantMessage += data.response;
            res.write(data.response);
          }
        } catch (parseError) {
          console.error('Failed to parse remaining buffer:', parseError.message);
        }
      }

      // If we exit the loop without data.done, still save and end
      if (assistantMessage) {
        await prisma.message.create({
          data: {
            chatId,
            role: 'assistant',
            content: assistantMessage
          }
        });
      }
      
      res.end();
      delete abortControllers[chatId];

    } catch (ollamaError) {
      console.error(' Ollama request error:', ollamaError);
      console.error(' Error details:', ollamaError.message);
      console.error('Error stack:', ollamaError.stack);
      
      if (ollamaError.name === 'AbortError') {
        console.log('Request was aborted by user');
        res.write('\n\n[Request cancelled by user]');
      } else if (ollamaError.code === 'ECONNREFUSED') {
        console.error(' Connection refused - Ollama service might not be running');
        res.write('Sorry, the AI service is not available. Please make sure Ollama is running.');
      } else {
        res.write('Sorry, I encountered an error processing your request. Please try again.');
      }
      
      res.end();
      delete abortControllers[chatId];
    }

  } catch (error) {
    console.error('Main function error:', error);
    console.error(' Error message:', error.message);
    console.error(' Error stack:', error.stack);
    
    // If headers weren't sent yet, send JSON error
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
        error: error.message,
      });
    } else {
      // If streaming already started, just end the stream
      res.write('\n\nSorry, an unexpected error occurred.');
      res.end();
    }
    
    // Clean up
    if (abortControllers[req.params.id]) {
      delete abortControllers[req.params.id];
    }
  }
};

const stopGeneration = async (req, res) => {
  try {
    const chatId = req.params.id;
    
    if (abortControllers[chatId]) {
      abortControllers[chatId].abort();
      delete abortControllers[chatId];
    }
    
    res.json({
      success: true,
      message: "Generation stopped"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error stopping generation",
      error: error.message
    });
  }
};

export { getMessage,
sendMessage,
stopGeneration
};
