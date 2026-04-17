async function checkAuth() {
    // 1. เริ่มต้น LIFF
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
        liff.login();
        return null;
    }

    const profile = await liff.getProfile();
    
    // 2. เรียกไปที่ GAS (ใส่ &type=pack เพื่อเช็คสิทธิ์ดูวิดีโอ)
    try {
        const response = await fetch(`${GAS_URL}?userId=${profile.userId}&type=pack`);
        const result = await response.json();

        // 3. เช็คสถานะจาก GAS
        if (result.status === "error") {
            if (result.message === "NOT_MEMBER") {
                // ⚠️ แก้จาก register.html เป็น account.html
                if (!window.location.pathname.includes('account.html')) {
                    window.location.href = `account.html?target=${encodeURIComponent(window.location.href)}`;
                }
            } else {
                alert("Error: " + result.message);
            }
            return null;
        }

        return result; // ส่ง status: success และ data (วิดีโอ) กลับไป
    } catch (e) {
        console.error("Auth Error:", e);
        return null;
    }
}