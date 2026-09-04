import nodemailer from "nodemailer"
import { NextResponse } from "next/server"


export async function POST(req) {
  try {
    const { firstname, lastname, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.app_password,
      },
    });

    const logoUrl = process.env.logoUrl
    const containerStyle = `
      font-family: Arial, sans-serif;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
    `;

    
    const mailToSelf = {
      to: process.env.email, 
      subject: "New Message from Contact Form",
      html: `
        <div style="${containerStyle}">
          <h2 style="color: #4CAF50; margin-bottom: 10px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstname} ${lastname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    };

    const mailToUser = {
      to: email,
      subject: "Thanks for Reaching Out!",
      html: `
        <div style="${containerStyle}">
          <h2 style="color: #4CAF50;">Hello ${firstname},</h2>
          <p>Thank you for reaching out! I’ve received your message and will get back to you as soon as possible.</p>

          <hr style="margin: 20px 0;" />

          <h4 style="color: #555;">Here's a copy of your message:</h4>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; white-space: pre-wrap;">${message}</div>

          <p style="margin-top: 30px;">Looking forward to connecting with you.</p>
          <p>Best Regards,<br><strong>${process.env.myname}</strong>
        </div>
      `,
    };

    const info1 = await transporter.sendMail(mailToSelf);
    const info2 = await transporter.sendMail(mailToUser);

    return NextResponse.json({
      message: "Message Sent",
      infoToSelf: info1,
      infoToUser: info2,
    });
  } catch (error) {
    return NextResponse.json({ message:"Message Failed",error: error.message }, { status: 401 });
  }
}
