module.exports = function(eleventyConfig) {
  // Copy img folder to output
  eleventyConfig.addPassthroughCopy("img");
  
  // Copy CSS folder to output
  eleventyConfig.addPassthroughCopy("css");
  
  // Copy mp3 folder to output
  eleventyConfig.addPassthroughCopy("mp3");
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    htmlTemplateEngine: "njk"
  };
};
