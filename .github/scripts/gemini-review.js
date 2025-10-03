import { GoogleGenAI } from '@google/genai';
import fs from "fs";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });
const green = '\x1b[32m';
const cyan = "\x1b[36m"

const filePath = process.argv[2];
try {
	const content = fs.readFileSync(filePath, 'utf8');
	console.log(`${green}File ${filePath}:`);
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: "Please review the following code commit diff. And provide feedback on how to improve it.\n" + content,
		systemInstructions: "Use a professional tone and a perspective of a lead developer."
	});
	console.log(`${cyan}${response.text}`)
} catch (err) {
	console.error(err);
}
