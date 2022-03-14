let allJobs = []
let filteredByTagsArray = new Array()
const placeholderText = 'Filter jobs by clicking on job tag'
const filterContainer = document.getElementById('filterContainer')
filterContainer.innerText = placeholderText
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

function setJobTypeText(jobType) {
  switch (true) {
    // full_time / contract / internship / freelance
    // other / part_time / <empty string>
    case jobType == 'full_time':
      return 'Full Time'
    case jobType == 'part_time':
      return 'Part Time'
    case jobType == 'contract':
      return 'Contract'
    case jobType == 'internship':
      return 'Internship'
    case jobType == 'freelance':
      return 'Freelance'
    default:
      return 'Other'
  }
}

function clearJobs() {
  while (jobsContainer.firstChild) {
    jobsContainer.removeChild(jobsContainer.lastChild)
  }
}

function removeElementsByClass(className) {
  let elements = document.getElementsByClassName(className)
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0])
  }
}

function addRemoveFilterListeners(
  filterRemoveButton,
  filteredByTags,
  filterTagText,
) {
  filterRemoveButton.addEventListener('click', () => {
    tagIndex = filteredByTags.indexOf(filterTagText)
    filteredByTags.splice(tagIndex, 1)
    let className = filterTagText
    removeElementsByClass(className)
    if (filterContainer.childNodes.length == 0) {
      filterContainer.innerText = 'Filter jobs by clicking on job tag'
    }
    createJobDivs(allJobs)
  })
}

function createJobDivs(allJobs) {
  console.log(allJobs)
  let jobsContainer = document.getElementById('jobsContainer')
  let filteredJobs = []
  console.log('Jobs Container Length: ', jobsContainer.childNodes.length)

  if (
    jobsContainer.childNodes.length == 0 ||
    filterContainer.innerText == 'Filter jobs by clicking on job tag'
  ) {
    clearJobs()
    for (let i = 0; i < allJobs.length; i++) {
      //below must go in for loop array length
      let jobContainer = createDiv('jobContainer')
      let jobLogo = createDiv('jobLogo')
      let companyLogo = allJobs[i].company_logo
      jobLogo.style.backgroundImage = `url("${companyLogo}")`
      let companyAndTag = createDiv('companyAndTag')
      let jobCompany = createDiv('jobCompany')
      let jobNew = createDiv('jobNew')
      // let jobTitle = createDiv('jobTitle')
      let jobTitle = document.createElement('a')
      jobTitle.setAttribute('id', 'jobTitle')
      jobTitle.href = allJobs[i].url
      let jobPostedTimeLocation = createDiv('jobPostedTimeLocation')
      let jobPosted = createDiv('jobPosted')
      let jobPostedTime = allJobs[i].publication_date
      let jobTime = createDiv('jobTime')
      let jobLocation = createDiv('jobLocation')
      let jobSkillsContainer = createDiv('jobSkills')
      let jobType = allJobs[i].job_type
      let jobTypeText = setJobTypeText(jobType)
      let jobSkillsToFilter = allJobs[i].tags

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

      if (
        postedDaysAgo(jobPostedTime) == 'Today' ||
        postedDaysAgo(jobPostedTime) == 'Yesterday'
      ) {
        jobNew.innerText = 'NEW!'
        companyAndTag.appendChild(jobNew)
      }
      addJobSkills(jobSkillsToFilter, jobSkillsContainer)
    }
    createFilterButtons()
  } else {
    // use this else for filtering jobs based on
    // filteredByTags = filterContainer.innerText.split(/\r?\n/)
    // allJobs     //    allJobs[i].tags
    let filterTagList = filterContainer.innerText.split(/\r?\n/)
    filterTagList = filterTagList.map((element) => {
      return element.toLowerCase()
    })
    for (let i = 0; i < allJobs.length; i++) {
      let jobTagList = allJobs[i].tags
      jobTagList = jobTagList.map((element) => {
        return element.toLowerCase()
      })
      // if a job contains a tag from filter tags
      let matchedTagsCount = 0
      for (let j = 0; j < jobTagList.length; j++) {
        let oneJobTag = jobTagList[j]
        if (filterTagList.indexOf(oneJobTag) != -1) {
          matchedTagsCount = matchedTagsCount + 1
          if (matchedTagsCount == filterTagList.length) {
            filteredJobs.push(allJobs[i])
            break
          }
        } else {
          continue
        }
      }
    }
    clearJobs()

    for (let i = 0; i < filteredJobs.length; i++) {
      // make job divs based on filteredJobs array
      let jobContainer = createDiv('jobContainer')
      let jobLogo = createDiv('jobLogo')
      let companyLogo = filteredJobs[i].company_logo
      jobLogo.style.backgroundImage = `url("${companyLogo}")`
      let companyAndTag = createDiv('companyAndTag')
      let jobCompany = createDiv('jobCompany')
      let jobNew = createDiv('jobNew')
      let jobTitle = createDiv('jobTitle')
      let jobPostedTimeLocation = createDiv('jobPostedTimeLocation')
      let jobPosted = createDiv('jobPosted')
      let jobPostedTime = filteredJobs[i].publication_date
      let jobTime = createDiv('jobTime')
      let jobLocation = createDiv('jobLocation')
      let jobSkillsContainer = createDiv('jobSkills')
      let jobType = filteredJobs[i].job_type
      let jobTypeText = setJobTypeText(jobType)
      let jobSkillsToFilter = filteredJobs[i].tags

      jobTime.innerText = jobTypeText
      jobCompany.innerText = filteredJobs[i].company_name
      jobTitle.innerText = filteredJobs[i].title
      jobPosted.innerText = postedDaysAgo(jobPostedTime)
      jobLocation.innerText = filteredJobs[i].candidate_required_location
      jobsContainer.appendChild(jobContainer)
      jobContainer.appendChild(jobLogo)
      jobContainer.appendChild(companyAndTag)
      companyAndTag.appendChild(jobCompany)
      jobContainer.appendChild(jobTitle)
      jobContainer.appendChild(jobPostedTimeLocation)
      jobPostedTimeLocation.append(jobPosted, jobTime, jobLocation)
      jobContainer.append(jobSkillsContainer)

      if (
        postedDaysAgo(jobPostedTime) == 'Today' ||
        postedDaysAgo(jobPostedTime) == 'Yesterday'
      ) {
        jobNew.innerText = 'NEW!'
        companyAndTag.appendChild(jobNew)
      }
      addJobSkills(jobSkillsToFilter, jobSkillsContainer)
    }
    createFilterButtons()
  }
}

function createFilterButtons() {
  let jobSkillButtons = document.querySelectorAll('.jobSkill')
  for (let j = 0; j < jobSkillButtons.length; j++) {
    jobSkillButtons[j].addEventListener('click', () => {
      window.scrollTo(0, 0)
      let duplicateTag = false

      if (filterContainer.innerText == 'Filter jobs by clicking on job tag') {
        filterContainer.innerText = ''
      }

      if (filterContainer.innerText == '') {
        let filterTagContainer = createDiv('filterTagContainer')
        filterTagContainer.classList.add(jobSkillButtons[j].innerText)
        let filterRemoveButton = document.createElement('button')
        filterRemoveButton.classList.add('filterRemoveButton')
        let filterTag = document.createElement('div')
        filterTag.classList.add('filterTag')
        filterTag.innerText = jobSkillButtons[j].innerText
        filterTagContainer.append(filterTag, filterRemoveButton)
        filterContainer.appendChild(filterTagContainer)
        let filteredByTags = filterContainer.innerText.split(/\r?\n/)
        filterTagText = jobSkillButtons[j].innerText
        addRemoveFilterListeners(
          filterRemoveButton,
          filteredByTags,
          filterTagText,
        )
        //add clear filters button
        let clearButton = document.createElement('button')
        clearButton.setAttribute('id', 'clearFilters')
        clearButton.innerText = 'Clear Filters'
        clearButton.addEventListener('click', () => {
          filterContainer.innerText = ''
          filterContainer.innerText = 'Filter jobs by clicking on job tag'
          clearFiltersContainer.removeChild(clearButton)
          clearJobs()
          createJobDivs(allJobs)
        })
        clearFiltersContainer.appendChild(clearButton)
        createJobDivs(allJobs)
      } else {
        let filteredByTags = filterContainer.innerText.split(/\r?\n/)
        for (let i = 0; i < filteredByTags.length; i++) {
          if (filteredByTags[i] == jobSkillButtons[j].innerText) {
            duplicateTag = true
          }
        }
        if (duplicateTag == false) {
          let filterTagContainer = createDiv('filterTagContainer')
          filterTagContainer.classList.add(jobSkillButtons[j].innerText)
          let filterRemoveButton = document.createElement('button')
          filterRemoveButton.classList.add('filterRemoveButton')
          let filterTag = document.createElement('div')
          filterTag.classList.add('filterTag')
          filterTag.innerText = jobSkillButtons[j].innerText
          filterTagContainer.append(filterTag, filterRemoveButton)
          filterContainer.appendChild(filterTagContainer)
          let filteredByTags = filterContainer.innerText.split(/\r?\n/)
          filterTagText = jobSkillButtons[j].innerText
          addRemoveFilterListeners(
            filterRemoveButton,
            filteredByTags,
            filterTagText,
          )
        }
        createJobDivs(allJobs)
      }
    })
  }
}
