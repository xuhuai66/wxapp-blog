const parser = require('parser-wxapp');
exports.main = async (event, context) => {
  const url = event.url;
  const content= parser(url,
    "website",
    {
      tagStyle: { code: "none" },
      autohighlight:false
    }).then(function (res) {
      return res;
    })
  return  content;
}

