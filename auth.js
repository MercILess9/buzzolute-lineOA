async function checkAuth() {
    await liff.init({ liffId: LIFF_ID });
    if (!liff.isLoggedIn()) {
        liff.login();
        return null;
    }
    const profile = await liff.getProfile();
    
    try {
        const response = await fetch(`${GAS_URL}?userId=${profile.userId}&type=link`);
        const result = await response.json();

        if (result.status === "error") {
            if (result.message === "NOT_MEMBER") {
                window.location.href = `account.html?target=${encodeURIComponent(window.location.href)}`;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: result.message,
                    customClass: { popup: 'swal-luxury' }
                });
            }
            return null;
        }
        return result; 

    } catch (e) {
        console.error("Auth Error:", e);
        return null;
    }
}