import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { messages, countryName, countryDescription } = await req.json();

    // Khởi tạo Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key') {
      return NextResponse.json(
        { error: 'Chưa cấu hình GEMINI_API_KEY trong file .env.local' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    // Tạo System Prompt (hướng dẫn cho AI)
    let systemInstruction = `Bạn là Đại sứ Văn hóa AI thân thiện, thông minh và dí dỏm. Nhiệm vụ của bạn là giải đáp các câu hỏi của học sinh lớp 8 về văn hóa các dân tộc trên thế giới. Bạn sẽ xưng là "Đại sứ" và gọi người dùng là "bạn" hoặc "em". Hãy trả lời ngắn gọn, súc tích (khoảng 3-4 câu), ngôn ngữ phù hợp với tuổi teen, có thể dùng emoji. Nếu được hỏi về thông tin ngoài lề, hãy khéo léo dẫn dắt học sinh quay lại chủ đề văn hóa.`;
    
    if (countryName) {
      systemInstruction += `\n\nNgười dùng đang quan tâm đến quốc gia: ${countryName}.`;
      if (countryDescription) {
        systemInstruction += `\nThông tin cơ bản về ${countryName}: ${countryDescription}.`;
      }
      systemInstruction += `\nHãy chủ động cung cấp những điều thú vị về văn hóa, phong tục, lễ hội, hoặc ẩm thực của ${countryName} nếu người dùng hỏi chung chung.`;
    }

    // Chuyển đổi định dạng messages cho Gemini (tách system message ra)
    // Lịch sử chat của Gemini cần format: { role: 'user' | 'model', parts: [{text: ...}] }
    let chatHistory = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Đảm bảo tin nhắn đầu tiên (nếu có lịch sử) phải là của user 
    // (Bỏ qua lời chào mặc định của AI)
    while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory.shift();
    }

    // Bắt đầu chat với system instruction (Gemini 1.5 hỗ trợ systemInstruction parameter)
    const chat = model.startChat({
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemInstruction }]
      },
      history: chatHistory.length > 1 ? chatHistory.slice(0, -1) : [], // Lấy tất cả trừ tin nhắn mới nhất
    });

    // Lấy tin nhắn mới nhất của người dùng
    const lastUserMessage = chatHistory[chatHistory.length - 1];
    
    // Gửi tin nhắn mới nhất và chờ phản hồi
    const result = await chat.sendMessage(lastUserMessage.parts[0].text);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Lỗi khi gọi AI: ' + error.message },
      { status: 500 }
    );
  }
}
