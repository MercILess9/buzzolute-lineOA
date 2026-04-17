async function checkAuth() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  const profile = await liff.getProfile();

  try {
    // 1. ดึงข้อมูลจาก Server (ต้องส่ง userId ไปเช็ก)
    const res = await fetch(`${GAS_URL}?userId=${profile.userId}&type=link`);
    const result = await res.json();

    // 2. ถ้าไม่สำเร็จ หรือไม่ใช่สมาชิก
    if (!result || result.status !== "success") {
      if (result?.message === "NOT_MEMBER") {
        // 🔥 จุดแก้: ห้ามไป account.html ให้ไปที่ GAS_URL พร้อมส่ง p=account
        window.location.href = `${GAS_URL}?p=account&userId=${profile.userId}`;
      }
      return null;
    }

    // 3. ถ้าสำเร็จ (และมีข้อมูล data ส่งมาด้วย)
    return result; 

  } catch (e) {
    console.error("Auth Error:", e);
    // ถ้า fetch พัง ให้ลองเช็กว่า GAS_URL ถูกต้องไหม
    return null;
  }
}