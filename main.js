let allJobs = []
let filteredByTagsArray = new Array()
const filterContainer = document.getElementById('filterContainer')
filterContainer.innerText = 'Filter jobs by clicking on job tag'
const clearFiltersContainer = document.getElementById('clearFiltersContainer')
const today = new Date()
const jobTags = [
  'it',
  'devops',
  'css',
  'html',
  'sql',
  'nosql',
  'js',
  'javascript',
  'react',
  'react.js',
  'angular',
  'angular.js',
  'node.js',
  'node',
  'golang',
  'rest',
  'ruby',
  'python',
  'aws',
  'php',
  'security',
]

let testingLength = []

async function getJobList() {
  let response = await fetch('https://remotive.io/api/remote-jobs')
  let data = await response.json()
  return data
}

getJobList().then((data) =>
  getAllJobs(data['jobs'])
    .then((allJobs) => createJobDivs(allJobs))
    .then(() => createFilterButtons()),
)

async function getAllJobs(array) {
  for (let i = 0; i < 50; i++) {
    allJobs.push(array[i])
  }
  return allJobs
}

function createDiv(id) {
  let div = document.createElement('div')
  div.setAttribute('id', id)
  return div
}

function addJobSkills(jobSkillsToFilter, jobSkillsContainer) {
  // for loop that appends job skills to #jobSkills
  let filteredJobSkills = jobSkillsToFilter.filter((item) => {
    let lowerItem = item.toLowerCase()
    return jobTags.includes(lowerItem)
  })

  for (let i = 0; i < filteredJobSkills.length; i++) {
    testingLength.push(filteredJobSkills.length)
    let jobSkill = document.createElement('button')
    jobSkill.classList.add('jobSkill')
    jobSkill.innerText = filteredJobSkills[i].toUpperCase()
    jobSkillsContainer.appendChild(jobSkill)
  }
}

function postedDaysAgo(jobPostedTime) {
  jobPostedTime = Date.parse(jobPostedTime)
  jobPostedTime = new Date(jobPostedTime)
  diffTime = Math.abs(jobPostedTime - today)
  diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays == 1) {
    return 'Today'
  } else if (diffDays == 2) {
    return 'Yesterday'
  } else if (diffDays >= 7 && diffDays < 14) {
    return '1w ago'
  } else if (diffDays >= 14 && diffDays < 21) {
    return '2w ago'
  } else if (diffDays >= 21 && diffDays < 28) {
    return '3w ago'
  } else if (diffDays > 28) {
    return 'Over 1m ago'
  } else {
    return diffDays.toString() + 'd ago'
  }
}

function createJobDivs(allJobs) {
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
    let jobPostedTime = allJobs[i].publication_date
    let jobTime = createDiv('jobTime')
    let jobLocation = createDiv('jobLocation')
    let jobSkillsContainer = createDiv('jobSkills')
    let jobType = allJobs[i].job_type
    let jobTypeText
    let jobSkillsToFilter = allJobs[i].tags

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

    jobPosted.innerText = postedDaysAgo(jobPostedTime)

    jobLocation.innerText = allJobs[i].candidate_required_location

    jobsContainer.appendChild(jobContainer)

    jobContainer.appendChild(jobLogo)

    jobContainer.appendChild(companyAndTag)

    companyAndTag.appendChild(jobCompany)

    jobContainer.appendChild(jobTitle)

    jobContainer.appendChild(jobPostedTimeLocation)

    jobPostedTimeLocation.append(jobPosted, jobTime, jobLocation)

    jobContainer.append(jobSkillsContainer)

    if (postedDaysAgo(jobPostedTime) == 'Today') {
      jobNew.innerText = 'NEW!'
      companyAndTag.appendChild(jobNew)
    }

    addJobSkills(jobSkillsToFilter, jobSkillsContainer)
  }
}

function createFilterButtons() {
  let jobSkillButtons = document.querySelectorAll('.jobSkill')
  for (let j = 0; j < jobSkillButtons.length; j++) {
    jobSkillButtons[j].addEventListener('click', () => {
      let filteredByTags = filterContainer.innerText.split(/\r?\n/)
      let duplicateTag = false

      if (filterContainer.innerText == 'Filter jobs by clicking on job tag') {
        filterContainer.innerText = ''
      }

      if (filterContainer.innerText == '') {
        let filterRemoveButton = document.createElement('button')
        filterRemoveButton.classList.add('filterRemoveButton')
        let filterTag = document.createElement('div')
        filterTag.classList.add('filterTag')
        filterTag.innerText = jobSkillButtons[j].innerText
        filterContainer.appendChild(filterTag)
        filterTag.appendChild(filterRemoveButton)
        //add clear filters button
        let clearButton = document.createElement('button')
        clearButton.setAttribute('id', 'clearFilters')
        clearButton.innerText = 'Clear Filters'
        clearButton.addEventListener('click', () => {
          filterContainer.innerText = ''
          filterContainer.innerText = 'Filter jobs by clicking on job tag'
          clearFiltersContainer.removeChild(clearButton)
        })
        clearFiltersContainer.appendChild(clearButton)
      } else {
        for (let i = 0; i < filteredByTags.length; i++) {
          console.log('array length: ', filteredByTags.length)
          console.log('array item: ', filteredByTags[i])
          console.log('tag inner text: ', jobSkillButtons[j].innerText)
          if (filteredByTags[i] == jobSkillButtons[j].innerText) {
            duplicateTag = true
          }
        }
        if (duplicateTag == false) {
          let filterRemoveButton = document.createElement('button')
          filterRemoveButton.classList.add('filterRemoveButton')
          let filterTag = document.createElement('div')
          filterTag.classList.add('filterTag')
          filterTag.innerText = jobSkillButtons[j].innerText
          filterContainer.appendChild(filterTag)
          filterTag.appendChild(filterRemoveButton)
        }
      }
    })
  }
}
