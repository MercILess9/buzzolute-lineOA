async function checkAuth() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  const profile = await liff.getProfile();

  try {
    // ยิงไปที่ Code.gs เพื่อเช็กว่าเป็นสมาชิกไหม และขอ data มาแสดงผล
    const res = await fetch(`${GAS_URL}?userId=${profile.userId}&type=link`);
    const result = await res.json();

    if (!result || result.status !== "success") {
      if (result?.message === "NOT_MEMBER") {
        // ถ้าไม่ใช่สมาชิก ให้เด้งไปหน้าลงทะเบียน
        window.location.href = "account.html"; 
      }
      return null;
    }

    // เมื่อคืนค่า result (ที่มี data อยู่ข้างใน) 
    // หน้า link15.html จะหยุด Loading และแสดง Card ทันที
    return result;

  } catch (e) {
    console.error("Auth Error:", e);
    return null;
  }
}