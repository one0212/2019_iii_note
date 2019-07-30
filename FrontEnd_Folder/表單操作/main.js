console.log(`main.js loaded!`)

const ERR_ACCOUNT_BLANK = '請輸入帳號'
const ERR_PASSWORD_BLANK = '請輸入密碼'

function doLogin() {
    let account = document.querySelector('#login-form input#account')
    let password = document.querySelector('#login-form input#password')

    let isError = false;
    if (account.value == '') {
        document.querySelector('#input-err-account').innerText = ERR_ACCOUNT_BLANK;
        isError = true;
    }
    if (password.value == '') {
        document.querySelector('#input-err-password').innerText = ERR_PASSWORD_BLANK;
        isError = true;
    }
    if (isError) {
        console.log(`表單驗證失敗，拒絕登入`);
        return !isError;
    }
    console.log(`account: ${account.value} password: ${password.value} is login`)
}