import { loadPyodide } from "pyodide";

export var Pyodide = (function () {
  var instance;
  function createInstance() {
    var object = new PythonRunner();
    return object;
  }
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

class PythonRunner {
  constructor() {
    this._output = console.log;
    this._pyodide = null;
    loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.2/full",
      packages: ["numpy", "scikit-learn"],
      stderr: (text) => {
        this._output(text);
      },
      stdout: (text) => {
        this._output(text);
      },
    }).then((result) => {
      this._pyodide = result;

      console.log(
        this._pyodide.runPython(`
            import sys
            sys.version
        `)
      );

      this._pyodide.runPython('print("Hello from Python!")');
    });
  }
  setOutput(output) {
    this._output = output;
  }
  async run(code) {
    if (this._pyodide) {
      await this._pyodide.loadPackage("numpy");
      await this._pyodide.loadPackage("scikit-learn");
      return this._pyodide.runPython(code);
    }
  }
}
