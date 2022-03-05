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

function createDiv(id) {
  let div = document.createElement('div')
  div.setAttribute('id', id)
  return div
}

function addJobSkills() {
  // for loop that appends job skills to #jobSkills
  let jobSkillsContainer = document.getElementById('jobSkills')

  //for i append div with class of .jobSkill
}

function createJobDivs(allJobs) {
  console.log(allJobs[1])

  //below must go in for loop array length

  const jobsContainer = document.getElementById('jobsContainer')
  let jobContainer = createDiv('jobContainer')
  let jobLogo = createDiv('jobLogo')
  let companyAndTag = createDiv('companyAndTag')
  let jobTitle = createDiv('jobTitle')
  let jobCompany = createDiv('jobCompany')
  let jobNew = createDiv('jobNew')
  let jobPostedTimeLocation = createDiv('jobPostedTimeLocation')
  let jobPosted = createDiv('jobPosted')
  let jobTime = createDiv('jobTime')
  let jobLocation = createDiv('jobLocation')

  jobsContainer.appendChild(jobContainer)

  jobContainer.appendChild(jobLogo)

  jobContainer.appendChild(companyAndTag)

  companyAndTag.append(jobCompany, jobNew)

  jobContainer.appendChild(jobTitle)

  jobContainer.appendChild(jobPostedTimeLocation)

  jobPostedTimeLocation.append(jobPosted, jobTime, jobLocation)

  // add my content from array here
}
