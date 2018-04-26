const fs = require('fs');
const { JSDOM } = require('jsdom');
const jQuery = require('jquery');
const stringSimilarity = require('string-similarity');


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

  return Math.pow(ratio, 0.5); // 0.5次方 MAGIC!!!
}

// 給路徑計算兩個html的相似度
function calculateTwoPath (path1, path2) {
  if (path1 === path2) {
    return 'n/a'
  }
  const text1 = getHtmlContentText(process.cwd() + path1);
  const text2 = getHtmlContentText(process.cwd() + path2);
  const lengthRatio = textLengthRatio(text1, text2);
  const similarity = stringSimilarity.compareTwoStrings(text1, text2);
  return similarity / lengthRatio;
}


class HtmlContentRepeatRate {
  constructor(pageList) {
    this.pageList = pageList;
    this.outputFolder = 'dist';
    this.outputFileName = 'output.csv';
  }

  getRepeatRate() {
    const comparisonArr = [];
    const headRow = this.pageList.map(x => x.name);
    headRow.unshift('htmlContentRepeatRate');
    comparisonArr.push(headRow);

    this.pageList.forEach((pageA) => {
      const rowArr = [pageA.name];
      this.pageList.forEach((pageB) => {
        const crossRate = calculateTwoPath(pageA.path, pageB.path);
        rowArr.push(crossRate);

        process.stdout.write('.');
      });
      comparisonArr.push(rowArr);

      process.stdout.write('\n');
    });

    if (!fs.existsSync(this.outputFolder)) {
      fs.mkdirSync(this.outputFolder);
    }

    console.log(this.outputFolder + '/' + this.outputFileName);
    // create csv string
    const csvStr = comparisonArr.map(row => row.join(', ')).join('\r\n');
    fs.writeFileSync(this.outputFolder + '/' + this.outputFileName, csvStr);
    process.stdout.write(this.outputFileName + ' saved !!\n');
  }
}

module.exports = HtmlContentRepeatRate;
