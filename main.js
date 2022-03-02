let allJobs = []

async function getJobList() {
  let response = await fetch('https://remotive.io/api/remote-jobs')
  let data = await response.json()
  return data
}

getJobList().then((data) =>
  getAllJobs(data['jobs']).then((allJobs) => createJobDivs(allJobs)),
)

async function getAllJobs(array) {
  for (let i = 0; i < 10; i++) {
    allJobs.push(array[i])
  }
  return allJobs
}

function createJobDivs(allJobs) {
  console.log(allJobs[1])
}
