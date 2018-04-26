const HtmlContentRepeatRate = require('./src/HtmlContentRepeatRate.js');

const PAGE_LIST = [
  {
    name: '首頁',
    path: '/html/index.html'
  },
  {
    name: 'app介紹',
    path: '/html/appIntro.html'
  },
  {
    name: '簡易刊比較',
    path: '/html/comparePlans.html'
  },
  {
    name: '服務契約',
    path: '/html/contract.html'
  },
  {
    name: '新客體驗',
    path: '/html/customerTrail.html'
  },
  {
    name: '下載表格',
    path: '/html/downloads.html'
  },
  {
    name: '英文簡介',
    path: '/html/englishIntro.html'
  },
  {
    name: '產品特色',
    path: '/html/features.html'
  },
  {
    name: '常見問題',
    path: '/html/help.html'
  },
  {
    name: '刊登方案',
    path: '/html/program.html'
  }
]

const hcrr = new HtmlContentRepeatRate(PAGE_LIST);
hcrr.getRepeatRate();
