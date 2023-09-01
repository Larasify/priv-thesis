function testShellJS() {
  var shell = require("shelljs");
  var output = shell.exec("echo hello world");
  if (output.code !== 0) {
    console.log("ShellJS is not installed");
  } else {
    console.log("ShellJS is installed");
  }
}

function testffmpeg() {
  var shell = require("shelljs");
  var output = shell.exec("ffmpeg -version");
  if (output.code !== 0) {
    console.log("ffmpeg is not installed");
  } else {
    console.log("ffmpeg is installed");
  }
  shell.mkdir(`./test-frames/testvideo`);
  var output = shell.exec(
    "ffmpeg -r 1 -i " +
      "testvideo.mp4" +
      ` -r 1 "./test-frames/testvideo/img%05d.png"`
  );
  if (output.code !== 0) {
    console.log("ffmpeg not working correctly");
  } else {
    console.log("ffmpeg is working correctly");
  }
}
function testCaterPipeline() {
  var shell = require("shelljs");
  const cater_install_path =
    "~/code/CATER/build/external/Build/cater/ui/cli/cater-cli";

  var output2 = shell.exec(
    `${cater_install_path} init ./test-frames/testvideo/`
  );
  if (output2.code !== 0) {
    console.log("Cater init failed");
  } else {
    console.log("Cater init success");
  }
  var output3 = shell.exec(
    `${cater_install_path} track ./test-frames/testvideo__output/now/results.yml`
  );
  if (output3.code !== 0) {
    console.log("Cater track failed");
  } else {
    console.log("Cater track success");
  }
}
function cleanup() {
  var shell = require("shelljs");
  shell.rm("-rf", "./test-frames/testvideo");
  shell.rm("-rf", "./test-frames/testvideo__output");
}

function testRequirements() {
  testShellJS();
  testffmpeg();
  testCaterPipeline();
  cleanup();
}
testRequirements();
