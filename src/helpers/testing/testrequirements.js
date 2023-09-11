
const testpath = "/home/larasify/code/priv-thesis/src/helpers/testing/";
const cater_install_path = "~/code/CATER/build/external/Build/cater/ui/cli/cater-cli";

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
  shell.mkdir("-p",`./src/helpers/testing/test-frames/testvideo`);
  var output = shell.exec(
    "ffmpeg -r 1 -i " +
      `${testpath}/testvideo.mp4` +
      ` -r 1 "${testpath}/test-frames/testvideo/img%05d.png"`
  );
  if (output.code !== 0) {
    console.log("ffmpeg not working correctly");
  } else {
    console.log("ffmpeg is working correctly");
  }
}
function testCaterPipeline() {
  var shell = require("shelljs");

  var output2 = shell.exec(
    `${cater_install_path} init src/helpers/testing/test-frames/testvideo/`
  );
  if (output2.code !== 0) {
    console.log("Cater init failed");
  } else {
    console.log("Cater init success");
  }
  var output3 = shell.exec(
    `${cater_install_path} track src/helpers/testing/test-frames/testvideo/_output/now/results.yml`
  );
  if (output3.code !== 0) {
    console.log("Cater track failed");
  } else {
    console.log("Cater track success");
  }
}
function cleanup() {
  var shell = require("shelljs");
  shell.rm("-rf", "./src/helpers/testing/test-frames");
}

function testRequirements() {
  testShellJS();
  testffmpeg();
  testCaterPipeline();
  cleanup();
}
testRequirements();
