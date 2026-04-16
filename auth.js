async function checkAuth() {
    // 1. เริ่มต้น LIFF
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
        liff.login();
        return null;
    }

    const profile = await liff.getProfile();
    
    // 2. เรียกไปที่ GAS (ต้องใส่ &type=pack เข้าไปด้วย!)
    const response = await fetch(`${GAS_URL}?userId=${profile.userId}&type=pack`);
    const result = await response.json();

    // 3. เช็กสถานะจาก GAS (ใช้ status ตามที่เราแก้ใน Main.gs)
    if (result.status === "error") {
        if (result.message === "NOT_MEMBER") {
            // ถ้าไม่ใช่สมาชิก ให้เด้งไปหน้าลงทะเบียน
            if (!window.location.pathname.includes('register.html')) {
                window.location.href = `register.html?target=${encodeURIComponent(window.location.href)}`;
            }
        } else {
            alert("Error: " + result.message);
        }
        return null;
    }

    // 4. ส่งค่ากลับให้ link15.html (ส่งไปก้อนเดียวเพื่อให้หน้าเว็บอ่าน status และ data ได้เลย)
    // หน้าเว็บจะใช้: auth.status และ auth.data
    return result; 
}