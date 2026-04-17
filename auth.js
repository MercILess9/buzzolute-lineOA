async function checkAuth() {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
        liff.login();
        return null;
    }

    const profile = await liff.getProfile();
    
    try {
        // ส่งไปเช็กที่ GAS ว่าเป็นสมาชิกไหม และขอข้อมูลวิดีโอ
        const response = await fetch(`${GAS_URL}?userId=${profile.userId}&type=pack`);
        const result = await response.json();

        if (result.status === "error") {
            if (result.message === "NOT_MEMBER") {
                // ⚠️ ต้องส่งไป account.html เท่านั้น
                window.location.href = `account.html?target=${encodeURIComponent(window.location.href)}`;
            } else {
                alert("Error: " + result.message);
            }
            return null;
        }
        return result; 
    } catch (e) {
        console.error("Auth Error:", e);
        return null;
    }
}