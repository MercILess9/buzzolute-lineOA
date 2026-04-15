// auth.js
async function checkMemberAccess() {
    try {
        // 1. เริ่มการทำงาน LIFF (ใช้ LIFF_ID จาก config.js)
        await liff.init({ liffId: LIFF_ID });

        // 2. ถ้ายังไม่ Login ให้บังคับ Login
        if (!liff.isLoggedIn()) {
            liff.login();
            return null; 
        }

        // 3. ดึง Profile เพื่อเอา UserId
        const profile = await liff.getProfile();
        const userId = profile.userId;

        // 4. ส่งไปเช็กสมาชิกที่ GAS
        const response = await fetch(`${GAS_URL}?type=pack&userId=${userId}`);
        const result = await response.json();

        // 5. ถ้าไม่ใช่สมาชิก ให้เด้งไปหน้า Register
        if (result.error === "NOT_MEMBER") {
            const currentPage = window.location.pathname.split("/").pop() || 'index.html';
            // ถ้าหน้าปัจจุบันไม่ใช่ register.html ถึงจะทำการดีด
            if (currentPage !== 'register.html') {
                window.location.href = `register.html?target=${currentPage}`;
            }
            return null;
        }

        // 6. ถ้าผ่าน... ส่งข้อมูลกลับไปให้หน้าหลักใช้งานต่อ
        return { userId, data: result };

    } catch (err) {
        console.error("Auth Error:", err);
        return null;
    }
}