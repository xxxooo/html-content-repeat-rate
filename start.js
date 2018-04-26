const fs = require('fs');
const { JSDOM } = require('jsdom');
const jQuery = require('jquery');
const stringSimilarity = require('string-similarity');

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

// 取得 html 內文內容，移除空白
function getHtmlContentText(path) {
  const html = fs.readFileSync(path, 'utf8');
  global.document = new JSDOM(html);
  const $ = jQuery(global.document.window);
  $('body script, body noscript').remove();
  return $('body').text().replace(/\s+/g, '');
}

// 計算兩個字串的長度比例 0~1 之間
function textLengthRatio (str1, str2) {
  const length1 = str1.length;
  const length2 = str2.length;
  const ratio = length1 < length2
    ? length1 / length2
    : length2 / length1;

  return Math.pow(ratio, 0.5);
}

// 給路徑計算兩個html的相似度
function htmlRepeatRate (path1, path2) {
  if (path1 === path2) {
    return 'n/a'
  }

  const text1 = getHtmlContentText(__dirname + path1);
  const text2 = getHtmlContentText(__dirname + path2);
  const lengthRatio = textLengthRatio(text1, text2);
  const similarity = stringSimilarity.compareTwoStrings(text1, text2);
  return similarity / lengthRatio;
}

const comparisonArr = [];
const headRow = PAGE_LIST.map(x => x.name);
headRow.unshift('htmlRepeatRate');
comparisonArr.push(headRow);

PAGE_LIST.forEach((pageA) => {
  const rowArr = [pageA.name];
  PAGE_LIST.forEach((pageB) => {
    const crossRate = htmlRepeatRate(pageA.path, pageB.path);
    rowArr.push(crossRate);

    process.stdout.write('.');
  });
  comparisonArr.push(rowArr);

  process.stdout.write('\n');
});

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}
// create csv string
const csvStr = comparisonArr.map(row => row.join(', ')).join('\r\n');
fs.writeFileSync('dist/output.csv', csvStr);
process.stdout.write('output.csv saved !!\n');
