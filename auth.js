async function checkAuth() {
  await liff.init({ liffId: LIFF_ID });
  if (!liff.isLoggedIn()) { liff.login(); return null; }

  const profile = await liff.getProfile();
  try {
    const res = await fetch(`${GAS_URL}?userId=${profile.userId}&type=link`);
    const result = await res.json();

    if (!result || result.status !== "success") {
      if (result?.message === "NOT_MEMBER") {
        // ถ้าไม่ใช่สมาชิก ให้ไปหน้าลงทะเบียน (ใช้ ?p=account)
        window.location.href = `${GAS_URL}?p=account`;
      }
      return null;
    }
    
    // คืนค่า result (ที่มี data) กลับไปให้หน้า link15.html
    return result; 

  } catch (e) {
    console.error("Auth Error:", e);
    return null;
  }
}