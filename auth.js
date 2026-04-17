async function checkAuth() {
    // 1. ปลุกระบบ LIFF ให้ตื่น
    await liff.init({ liffId: LIFF_ID });

    // 2. เช็กว่าล็อกอินหรือยัง ถ้ายังให้ Login ทันที
    if (!liff.isLoggedIn()) {
        liff.login();
        return null;
    }

    // 3. ดึงข้อมูลโปรไฟล์ เพื่อเอา User ID มาใช้งาน
    const profile = await liff.getProfile();
    
    try {
        // 4. ส่งข้อมูลไปเช็กที่ GAS 
        // 🚩 จุดที่คุณต้องการ: เปลี่ยนจาก type=pack เป็น type=link เรียบร้อยครับ
        const response = await fetch(`${GAS_URL}?userId=${profile.userId}&type=link`);
        const result = await response.json();

        // 5. จัดการกรณีที่ GAS ตอบกลับมาว่ามี Error
        if (result.status === "error") {
            // กรณี: ยังไม่ได้สมัครสมาชิก
            if (result.message === "NOT_MEMBER") {
                // ส่งไปหน้าสมัครสมาชิก (account.html) 
                // พร้อมแปะ ?target ไว้เพื่อให้สมัครเสร็จแล้วเด้งกลับมาหน้านี้ได้ถูก
                window.location.href = `account.html?target=${encodeURIComponent(window.location.href)}`;
            } else {
                // กรณี: Error อื่นๆ (เช่น หาไฟล์ไม่เจอ หรือระบบ GAS พัง)
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: result.message,
                    customClass: { popup: 'swal-luxury' }
                });
            }
            return null;
        }

        // 6. ถ้าผ่าน (เป็นสมาชิก) จะส่งค่าข้อมูลที่ได้จาก GAS กลับไปให้หน้าเว็บใช้งานต่อ
        return result; 

    } catch (e) {
        // กรณี: การ Fetch ข้อมูลล้มเหลว (เช่น อินเทอร์เน็ตหลุด)
        console.error("Auth Error:", e);
        return null;
    }
}