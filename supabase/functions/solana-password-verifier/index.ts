import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import nacl from 'npm:tweetnacl@1.0.3';
import { bs58 } from 'https://esm.sh/@project-serum/anchor@0.26.0/dist/cjs/utils/bytes/bs58.js';

console.log('Solana Password Verifier Hook Initialized');

serve(async (req) => {
  try {
    const { email: publicKeyStr, password: signatureStr, data } = await req.json();

    // 在註冊時，原始訊息會被傳入
    // 在登入時，我們需要定義相同的靜態訊息
    const messageToSign = data?.original_message || "請簽署此訊息以登入我們的應用程式。";

    const messageBytes = new TextEncoder().encode(messageToSign);
    const publicKeyBytes = bs58.decode(publicKeyStr);
    const signatureBytes = bs58.decode(signatureStr);

    // 使用 tweetnacl 驗證簽名
    const isVerified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    if (!isVerified) {
      throw new Error('Invalid signature');
    }

    // 如果驗證成功，返回給 Supabase 一個 session hook decision
    return new Response(
      JSON.stringify({
        decision: 'accept', // 接受這個密碼
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Verification failed:', error.message);
    // 如果驗證失敗，告訴 Supabase 拒絕這個密碼
    return new Response(
      JSON.stringify({
        decision: 'reject',
        message: 'Invalid Solana signature.', // 可選的錯誤訊息
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200, // Hook 本身要返回 200，但 decision 是 reject
      }
    );
  }
}); 