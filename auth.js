async function checkAuth(type = "link15") {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  const profile = await liff.getProfile();

  try {
    const res = await fetch(
      `${GAS_URL}?userId=${profile.userId}&type=${type}`
    );

    const result = await res.json();

    if (result.status !== "success") {

      if (result.message === "NOT_MEMBER") {
        window.location.href = "account.html";
      }

      return null;
    }

    return result;

  } catch (e) {
    console.error(e);
    return null;
  }
}