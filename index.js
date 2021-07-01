require('dotenv').config()
const puppeteer = require('puppeteer');
const fs = require('fs');

async function start() {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://sistemas.ufsc.br/login?service=https%3A%2F%2Fmoodle.ufsc.br%2Flogin%2Findex.php')
  await page.waitForSelector('#username')

  const username = process.env.MOODLE_USERNAME
  const password = process.env.MOODLE_PASSWORD

  await page.evaluate((username, password) => {
    $('#username').val(username)
    $("#password").val(password)
    $("input[type=submit]").click()
  }, username, password)

  await page.waitForSelector("a[title='INE5403-01208A (20211)']")
  await page.goto("https://moodle.ufsc.br/mod/bigbluebuttonbn/view.php?id=2989169")
  await page.evaluate(() => {
    $("#join_button_input").click()
  })

  await new Promise(_ => setTimeout(_, 15000))

  const lista = await page.evaluate(() => {
    const nodeList = document.querySelectorAll('.item--ZDfG6l')
    const itensArray = [...nodeList]
    const list = itensArray.map(div => ({
      owner: div.children[0].children[1].children[0].children[0].innerText,
      message: div.children[0].children[1].children[1].innerText
    }))
    console.log(list)
    return list
  })

  console.log(lista)
}


start()