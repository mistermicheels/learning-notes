module.exports = {
    files: ["**/*.md"],
    ignore: ["node_modules/**/*.*", "_*/**/*.*"],
    from: /\t/g,
    to: "    "
};
