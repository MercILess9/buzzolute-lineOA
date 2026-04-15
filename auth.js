async function checkAuth() {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
        liff.login();
        return null;
    }
    const profile = await liff.getProfile();
    const response = await fetch(`${GAS_URL}?userId=${profile.userId}`);
    const result = await response.json();

    if (result.error === "NOT_MEMBER") {
        // ถ้าหน้าปัจจุบันไม่ใช่ register.html ให้เด้งไปลงทะเบียน
        if (!window.location.pathname.includes('register.html')) {
            window.location.href = `register.html?target=${encodeURIComponent(window.location.href)}`;
        }
        return null;
    }
    return { profile, data: result };
}