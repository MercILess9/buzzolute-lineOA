async function checkAuth() {
  // 1. เริ่มต้นระบบ LIFF (LIFF_ID ต้องอยู่ใน config.js)
  await liff.init({ liffId: LIFF_ID });

  // 2. ตรวจสอบการ Login
  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  // 3. ดึงข้อมูล Profile ของผู้ใช้
  const profile = await liff.getProfile();

  try {
    // 4. ยิง Fetch ไปที่ GAS (ใช้ Switch Case 'type=link')
    // หมายเหตุ: GAS_URL ต้องลงท้ายด้วย /exec
    const res = await fetch(`${GAS_URL}?userId=${profile.userId}&type=link`);
    const result = await res.json();

    // 5. ถ้า Server ตอบกลับว่าไม่ใช่สมาชิก (NOT_MEMBER)
    if (!result || result.status !== "success") {
      if (result?.message === "NOT_MEMBER") {
        // เปลี่ยนหน้าไปที่หน้า Account (ใช้ ?p= เพื่อให้ doGet เลือกระหว่าง account/link15)
        window.location.href = `${GAS_URL}?p=account&userId=${profile.userId}`;
      }
      return null;
    }

    // 6. ส่งผลลัพธ์กลับไป (ในนี้จะมีก้อน data: { Buzzolute: ..., Links: ... })
    // เมื่อส่งค่านี้กลับไป หน้า link15.html จะหยุดโหลดและแสดงข้อมูลทันที
    return result;

  } catch (e) {
    console.error("Auth Error:", e);
    return null;
  }
}