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
  for (let i = 0; i < 1000; i++) {
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
  let jobSkill = document.createElement('button')
  jobSkill.classList.add('jobSkill')
  jobSkill.innerText = jobSkillsContainer.appendChild(jobSkill) /////
}

function createJobDivs(allJobs) {
  console.log(allJobs[1])

  for (let i = 0; i < allJobs.length; i++) {
    //below must go in for loop array length

    const jobsContainer = document.getElementById('jobsContainer')
    let jobContainer = createDiv('jobContainer')
    let jobLogo = createDiv('jobLogo')
    let companyAndTag = createDiv('companyAndTag')
    let jobCompany = createDiv('jobCompany')
    let jobNew = createDiv('jobNew')
    let jobTitle = createDiv('jobTitle')
    let jobPostedTimeLocation = createDiv('jobPostedTimeLocation')
    let jobPosted = createDiv('jobPosted')
    let jobTime = createDiv('jobTime')
    let jobLocation = createDiv('jobLocation')
    let jobSkillsContainer = createDiv('jobSkills')
    let jobType = allJobs[i].job_type
    let jobTypeText

    switch (true) {
      // full_time / contract / internship / freelance
      // other / part_time / <empty string>
      case jobType == 'full_time':
        jobTypeText = 'Full Time'
        break
      case jobType == 'part_time':
        jobTypeText = 'Part Time'
        break
      case jobType == 'contract':
        jobTypeText = 'Contract'
        break
      case jobType == 'internship':
        jobTypeText = 'Internship'
        break
      case jobType == 'freelance':
        jobTypeText = 'Freelance'
        break
      default:
        jobTypeText = 'Other'
    }

    jobTime.innerText = jobTypeText
    jobCompany.innerText = allJobs[i].company_name
    jobTitle.innerText = allJobs[i].title
    jobPosted.innerText = allJobs[i].publication_date
    jobLocation.innerText = allJobs[i].candidate_required_location

    jobsContainer.appendChild(jobContainer)

    jobContainer.appendChild(jobLogo)

    jobContainer.appendChild(companyAndTag)

    companyAndTag.append(jobCompany, jobNew)

    jobContainer.appendChild(jobTitle)

    jobContainer.appendChild(jobPostedTimeLocation)

    jobPostedTimeLocation.append(jobPosted, jobTime, jobLocation)

    jobContainer.append(jobSkillsContainer)
  }
}
