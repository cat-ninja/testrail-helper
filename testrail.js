const axios = require("axios");
const fs = require("fs");
const path = require("path");

class TestRail {
  constructor(defaultConfig) {
    this.host = defaultConfig.host;
    this.user = defaultConfig.user;
    this.password = defaultConfig.password;
    this.uri = "/index.php?/api/v2/";

    // const b = new Buffer(`${this.user}:${this.password}`);
    // const basicAuth = b.toString("base64");

    axios.defaults.baseURL = this.host + this.uri;
    // axios.defaults.headers.Authorization = `Basic ${basicAuth}`;
    axios.defaults.auth = {
      username: this.user,
      password: this.password,
    };
    axios.defaults.headers.get["Content-Type"] = "application/json";
  }

  async addPlan(projectId, data) {
    try {
      const res = await axios({
        method: "post",
        url: "add_plan/" + projectId,
        data,
      });
      return res.data;
    } catch (error) {
      console.error(`Cannnot add new plan due to ${error}`);
    }
  }

  async addPlanEntry(planId, data) {
    try {
      const res = await axios({
        method: "post",
        url: "add_plan_entry/" + planId,
        data,
      });
      return res.data;
    } catch (error) {
      console.error(
        `Cannnot add new test run to existing test plan due to ${error}`
      );
    }
  }

  async getSuites(projectId) {
    try {
      const res = await axios({
        method: "get",
        url: "get_suites/" + projectId,
        headers: {
          "content-type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.error(`Cannnot get suites due to ${error}`);
    }
  }

  async getConfigs(projectId) {
    try {
      const res = await axios({
        method: "get",
        url: "get_configs/" + projectId,
        headers: {
          "content-type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      console.error(`Cannnot get configs due to ${error}`);
    }
  }

  async addRun(projectId, data) {
    try {
      const res = await axios({
        method: "post",
        url: "add_run/" + projectId,
        data,
      });

      return res.data;
    } catch (error) {
      console.error(`Cannnot add new run due to ${error}`);
    }
  }

  async updateRun(runId, data) {
    try {
      const res = await axios({
        method: "post",
        url: "update_run/" + runId,
        data,
      });
      console.log(`The run with id: ${runId} is updated`);
      return res.data;
    } catch (error) {
      console.error(`Cannnot update run due to ${error}`);
    }
  }

  async getTests(runId) {
    try {
      const res = await axios({
        method: "get",
        url: `get_tests/${runId}`,
      });
      return res.data;
    } catch (error) {
      console.error(`Cannnot get tests of ${runId} due to ${error}`);
    }
  }

  async getResultsForCase(runId, caseId) {
    return axios({
      method: "get",
      url: "get_results_for_case/" + runId + "/" + caseId,
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        console.log(`The response is ${JSON.stringify(res.data)}`);
        console.log(`The case ${caseId} on run ${runId} is updated`);
        return res.data;
      })
      .catch((error) => {
        console.error(
          `Cannnot get results for case ${caseId} on run ${runId} due to ${error}`
        );
      });
  }

  async addResultsForCases(runId, data) {
    return axios({
      method: "post",
      url: "add_results_for_cases/" + runId,
      data,
    })
      .then((res) => {
        console.log(`The response is ${JSON.stringify(res.data)}`);
        return res.data;
      })
      .catch((error) => {
        console.error(
          `Cannnot add result for case due to ${error}. \n${JSON.stringify(
            error,
            null,
            2
          )}`
        );
      });
  }

  async addAttachmentToResult(resultId, imageFile) {
    var form = new FormData();
    form.append(
      "attachment",
      fs.createReadStream(path.join(global.output_dir, imageFile.toString()))
    );

    axios({
      method: "post",
      data: form,
      url: "add_attachment_to_result/" + resultId,
      headers: form.getHeaders(),
    }).catch((err) => {
      console.error(`Cannot attach file due to ${err}`);
    });
  }
}

module.exports = {
  createClient(config) {
    return new TestRail(config);
  },
};
