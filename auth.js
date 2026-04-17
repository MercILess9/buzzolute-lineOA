async function checkAuth() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  const profile = await liff.getProfile();

  try {
    const res = await fetch(`${GAS_URL}?userId=${profile.userId}&type=link`);
    const result = await res.json();

    if (!result || result.status !== "success") {
      if (result?.message === "NOT_MEMBER") {
        window.location.href =
          `account.html?target=${encodeURIComponent(location.href)}`;
      }
      return null;
    }

    return result;

  } catch (e) {
    console.error("Auth Error:", e);
    return null;
  }
}