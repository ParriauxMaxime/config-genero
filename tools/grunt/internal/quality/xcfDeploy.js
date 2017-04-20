/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

var path = require("path"),
  fs = require("fs"),
  childProcess = require('child_process'),
  glob = require('glob');

module.exports = function(grunt) {
  grunt.config.merge({
    "xcf_deploy": {
      local: {
        files: [{
          src: "tests/**/*.xcf"
        }]
      }
    }
  });
  grunt.registerMultiTask('xcf_deploy', 'Deploy xcf on gas', function() {
    var filter = grunt.option("filter");
    this.files.forEach(function(files) {
      files.src.map(function(file) {
        if (!filter || file.indexOf(filter) > 0) {
          var dir = path.dirname(file),
            folderFiles = fs.readdirSync(dir),
            baseName = path.basename(file),
            appName = path.basename(file, ".xcf"),
            appGar = appName + ".gar",
            ext = path.extname(file.toLowerCase());
          if (ext === ".xcf") {
            var env = Object.create(process.env);
            glob.sync(path.join(dir, "*.42f")).forEach(function(item) {
              try {
                fs.unlinkSync(item);
              } catch (e) {
                console.log(e);
              }
            });

            glob.sync(path.join(dir, "*.42m")).forEach(function(item) {
              try {
                fs.unlinkSync(item);
              } catch (e) {
                console.log(e);
              }
            });
            glob.sync(path.join(dir, "*.gar")).forEach(function(item) {
              try {
                fs.unlinkSync(item);
              } catch (e) {
                console.log(e);
              }
            });
            glob.sync(path.join(dir, "MANIFEST")).forEach(function(item) {
              try {
                fs.unlinkSync(item);
              } catch (e) {
                console.log(e);
              }
            });

            if (!env.FGLDIR) {
              console.log("$FGLDIR is not defined");
            } else {
              if (folderFiles.indexOf(".locale") >= 0) {
                try {
                  env.LANG = fs.readFileSync(path.join(dir, ".locale"), "utf-8");
                  console.log("should compile with LANG=" + env.LANG);
                } catch (e) {}
              }

              folderFiles
                .filter(fd => /\.per$/.test(fd.toLowerCase()))
                .forEach(fd => {
                  try {
                    childProcess.execSync(path.join(env.FGLDIR, "bin/fglform") + " -M " + fd, {
                      cwd: dir,
                      env: env
                    });
                  } catch (e) {
                    console.log(e.stdout.toString());
                    console.log(e.stderr.toString());
                  }
                });

              //need to link modules together if .fgl2p file exists
              if (folderFiles.indexOf(".fgl2p") >= 0) {
                var pouetList = [];
                folderFiles
                  .filter(fd => /\.4gl$/.test(fd.toLowerCase()))
                  .forEach(fd => {
                    pouetList.push(fd);
                  });
                try {
                  childProcess.execSync(path.join(env.FGLDIR, "bin/fgl2p") + " -o " + appName + ".42r " + pouetList.join(" "), {
                    cwd: dir,
                    env: env
                  });
                } catch (e) {
                  console.log(e);
                }
              } else {
                folderFiles
                  .filter(fd => /\.4gl$/.test(fd.toLowerCase()) && fd !== (appName + ".4gl"))
                  .forEach(fd => {
                    try {
                      childProcess.execSync(path.join(env.FGLDIR, "bin/fglcomp") + " -M " + fd, {
                        cwd: dir,
                        env: env
                      });
                    } catch (e) {
                      console.log(e);
                    }
                  });
                try {
                  childProcess.execSync(path.join(env.FGLDIR, "bin/fglcomp") + " -M " + (appName + ".4gl"), {
                    cwd: dir,
                    env: env,
                    //   stdio: ['pipe', 'ignore', 'ignore']
                  });
                } catch (e) {
                  if (e.toString().indexOf("cannot be opened") >= 0) {
                    console.warn(appName + ".4gl does not exist");
                  } else {
                    console.log(e);
                  }
                }
              }
            }
            console.log("deploying", baseName);
            if (!env.FGLASDIR) {
              console.log("$FGLASDIR is not defined");
            } else {
              var garpath = path.join(env.FGLDIR, "bin/fglgar");
              var command = garpath + " gar --application=" + baseName + " --output=" + appGar;
              try {
                // need full path with .exe extension for windows operating system
                fs.accessSync(garpath + (process.platform === "win32" ? ".exe" : ""), fs.R_OK | fs.X_OK);
              } catch (e) { // from GAS
                garpath = path.join(env.FGLASDIR, "bin/fglgar");
                command = garpath + " -g --application=" + baseName + " -o=" + appGar;
              }
              try {
                childProcess.execSync(command, {
                  cwd: dir,
                  env: env
                });
              } catch (e) {
                console.log(e);
              }
              let needGar = "";
              try {
                let result = childProcess.execSync(path.join(env.FGLASDIR, "bin/gasadmin") + " gar", {
                  cwd: dir,
                  env: env
                });
                if (("" + (result || "")).indexOf("gasadmin gar") >= 0) {
                  needGar = " gar";
                }
              } catch (e) {}

              try {
                childProcess.execSync(path.join(env.FGLASDIR, "bin/gasadmin") + `${needGar} --disable-archive=` + appGar, {
                  cwd: dir,
                  env: env
                });
              } catch (e) {}
              try {
                childProcess.execSync(path.join(env.FGLASDIR, "bin/gasadmin") + `${needGar} --undeploy-archive=` + appGar, {
                  cwd: dir,
                  env: env
                });
              } catch (e) {}
              try {
                childProcess.execSync(path.join(env.FGLASDIR, "bin/gasadmin") + `${needGar} --deploy-archive=` + appGar, {
                  cwd: dir,
                  env: env
                });
              } catch (e) {
                console.log(e.stdout.toString("utf-8"), e.stderr.toString("utf-8"));
              }
              try {
                childProcess.execSync(path.join(env.FGLASDIR, "bin/gasadmin") + `${needGar} --enable-archive=` + appGar, {
                  cwd: dir,
                  env: env
                });
              } catch (e) {
                console.log(e.stdout.toString("utf-8"), e.stderr.toString("utf-8"));
              }
            }
          }
        }
      });
    });
  });

  grunt.registerTask("xcfdeploy", ["xcf_deploy:local"]);
};
