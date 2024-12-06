const express = require('express');
const bodyParser = require('body-parser');
const openai = require('./openai'); // OpenAI API setup
const db = require('./db'); // Database connection setup
require('dotenv').config();

const app = express(); // Initialize Express
app.use(bodyParser.json());

// In-memory user session storage
const userSessions = {};

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { userId, message } = req.body;

    if (!userSessions[userId]) {
        userSessions[userId] = {
            messages: [
                {
                    role: "system",
                    content: `
You are an expert on Danfoss drives for industrial applications. You help users find the most suitable Danfoss drive for their application or machines. Engage in a natural, open conversation to gather information about the user's needs, such as industry, application, voltage, and power. Once you have enough information, send the key information to the backend in a structure formate for database inquary and collect information about the product from the backend and summarize them in a user-friendly manner to the user.

Your task is to:
- Dynamically understand the user's needs based on their input.
- Extract key information required to query the database.
- Dynamically understand the user's needs and extract key details:
- ALWAYS provide details in structure formate
- When sufficient details are collected, instruct the backend to execute a query by using the following format:
{QueryRequest: Industry: <value>, Application: <value>, Voltage: <value>, Power: <value>} 
Example:{QueryRequest: Industry: Mining and Cement, Application: Conveyors, Voltage: 200, Power: 24}
- If any details are missing, ask the user specifically for the missing information.
- NEVER fabricate product recommendations or details.
- Respond in this structured format to help the backend process your output. Once all details are collected, inform the backend to perform a database query.
- Do NOT attempt to generate SQL queries.
- There are 5 industries in the database, which are 'Food, Beverage & Packing', 'Mining and Cement', 'Chemical', 'Cranes & Hoists', 'Elevators & Escalators'. Whenever users input an industry, then corresponds to the relevant predefined application and is filled out accordingly for backend.
- There are 23 applications in the database, which are 'Centrifuges & Decanters', 'Charging', 'Compressors', 'Conveyors', 'Cranes, Hoists', 'Cranes & Hoists', 'Drilling', 'Elevators', 'Escalators', 'Energy Storage', 'Fans & Dryers', 'Mills, Drums, Kilns', 'Power Conversion System PCS', 'Positioning, Sync', 'Process & Material Treatment', 'Pumps', 'Winches, Tensioners', 'Grinder & Roller', 'Mixer', 'Dosing systems', 'Kneader', 'Crusher', 'Material Handling'. Whenever users input an application, then corresponds to the relevant predefined application and is filled out accordingly for backend.
- Once the backend returns the query results, summarize them in a user-friendly manner and present them to the user.
- If the user input is insufficient, ask follow-up questions conversationally to collect the missing details.
- Use a friendly, conversational tone in all interactions.
- If the user asks about anything other than Danfoss drives, politely redirect them to focus on the selection of Danfoss drives.
- Do not generate hypothetical product details or features, do not asume and come up with a product which is not in the database.
- If no matching products are found in the database, inform the user with: "No matching products found in the database."
- Do not give more than three drive recommendations. Prioritize the drive based on the user's need. If you find an exact match, only give one recommendation.
                        
                        `,
                },
            ],
        };
    }

    const session = userSessions[userId];
    session.messages.push({ role: "user", content: message });

    try {
        console.log("Step 1: Sending user input to ChatGPT...");
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: session.messages,
        });

        const assistantMessage = chatResponse.choices[0].message.content;
        console.log("Step 2: ChatGPT Response:", assistantMessage);

        session.messages.push({ role: "assistant", content: assistantMessage });

        // Check if ChatGPT has provided a QueryRequest
        if (assistantMessage.includes("{QueryRequest:")) {
            console.log("Step 3: QueryRequest detected.");

            const details = parseQueryRequest(assistantMessage);

            if (details) {
                const { industry, application, voltage, power } = details;

                console.log("Step 4: Executing SQL Query with details:", details);

                const sqlQuery = `
                    SELECT 
                        P.ProductName, 
                        P.ProductDetails, 
                        P.ProductFeatures
                    FROM 
                        Products P
                    JOIN 
                        Product_Application PA ON P.ProductID = PA.ProductID
                    JOIN 
                        Applications A ON PA.ApplicationID = A.ApplicationID
                    JOIN 
                        Industries I ON PA.IndustryID = I.IndustryID
                    WHERE 
                        I.IndustryName = ?
                        AND A.ApplicationName = ?
                        AND P.MinVoltage <= ?
                        AND P.MaxVoltage >= ?
                        AND P.MinPower <= ?
                        AND P.MaxPower >= ?;
                `;

                const queryParams = [industry, application, voltage, voltage, power, power];

                try {
                    const [rows] = await db.execute(sqlQuery, queryParams);

                    if (rows.length > 0) {
                        const resultSummary = rows.map(row => {
                            return `**Product Name:** ${row.ProductName}\n**Product Details:** ${row.ProductDetails}\n**Product Features:** ${row.ProductFeatures}`;
                        }).join("\n\n");

                        session.messages.push({
                            role: "assistant",
                            content: `Here are the database results:\n\n${resultSummary}`,
                        });

                        return res.json({ reply: resultSummary });
                    } else {
                        return res.json({ reply: "No matching products found for the provided details." });
                    }
                } catch (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ reply: "Error executing the query. Please try again later." });
                }
            } else {
                console.error("Invalid QueryRequest format.");
                return res.status(400).json({ reply: "Invalid QueryRequest format received from ChatGPT." });
            }
        } else {
            // Forward ChatGPT's response to the frontend if not a QueryRequest
            return res.json({ reply: assistantMessage });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ reply: "Something went wrong. Please try again later." });
    }
});

// Updated parseQueryRequest function
function parseQueryRequest(response) {
    try {
        const queryRequestMatch = response.match(/\{QueryRequest:([^}]+)\}/);
        if (!queryRequestMatch) return null;

        const queryRequestContent = queryRequestMatch[1];

        const industryMatch = queryRequestContent.match(/Industry:\s*([^,]+)/i);
        const applicationMatch = queryRequestContent.match(/Application:\s*([^,]+)/i);
        const voltageMatch = queryRequestContent.match(/Voltage:\s*(\d+)/i);
        const powerMatch = queryRequestContent.match(/Power:\s*(\d+)/i);

        if (industryMatch && applicationMatch && voltageMatch && powerMatch) {
            return {
                industry: industryMatch[1].trim(),
                application: applicationMatch[1].trim(),
                voltage: parseInt(voltageMatch[1], 10),
                power: parseInt(powerMatch[1], 10),
            };
        }
    } catch (error) {
        console.error("Error parsing QueryRequest:", error);
    }
    return null;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(express.static('public'));