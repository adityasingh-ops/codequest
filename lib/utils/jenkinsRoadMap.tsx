import { JenkinsRoadmapData } from "./problemData";

export const jenkinsRoadmapData: JenkinsRoadmapData = {
  "Phase 1": {
    title: "Foundation + First PRs",
    duration: "Oct 15 - Nov 15",
    focus: "Setup + First Contributions",
    outcome: "2-3 PRs merged",
    weeks: {
      "Week 1": {
        title: "Jenkins Basics + Setup",
        goal: "Understand Jenkins architecture, set up locally, join community",
        days: [
          {
            taskId: "p1w1d1",
            title: "Jenkins Architecture & Introduction",
            description: "Learn what Jenkins does and its core architecture",
            estimatedHours: 1.5,
            deliverable: "Notes on Controller, Agent, Executor, Plugin concepts",
            resources: [
              "https://www.jenkins.io/doc/developer/architecture/",
              "https://play.jenkins.io/"
            ]
          },
          {
            taskId: "p1w1d2",
            title: "Clone & Build Jenkins",
            description: "Clone Jenkins repo and build it locally",
            estimatedHours: 1.5,
            deliverable: "Screenshot of successful local build",
            resources: [
              "https://github.com/jenkinsci/jenkins",
              "https://github.com/jenkinsci/jenkins/blob/master/CONTRIBUTING.md"
            ]
          },
          {
            taskId: "p1w1d3",
            title: "Local Jenkins Setup",
            description: "Start Jenkins locally and explore UI",
            estimatedHours: 1.5,
            deliverable: "Create freestyle job and pipeline job, install 2-3 plugins",
            resources: ["http://localhost:8080"]
          },
          {
            taskId: "p1w1d4",
            title: "Join Community",
            description: "Join Jenkins Gitter and mailing list, introduce yourself",
            estimatedHours: 1.5,
            deliverable: "Post introduction + screenshot",
            resources: [
              "https://app.gitter.im/#/room/#jenkinsci_jenkins:gitter.im",
              "https://groups.google.com/g/jenkinsci-dev"
            ]
          },
          {
            taskId: "p1w1d5",
            title: "Explore Codebase Structure",
            description: "Read Developer Guide and explore Jenkins codebase",
            estimatedHours: 1.5,
            deliverable: "Diagram of code structure in notes",
            resources: ["https://www.jenkins.io/doc/developer/"]
          },
          {
            taskId: "p1w1d6",
            title: "Browse Jenkins JIRA",
            description: "Find good first issues on Jenkins JIRA",
            estimatedHours: 1.5,
            deliverable: "Bookmark 3 potential issues to work on",
            resources: ["https://issues.jenkins.io/"]
          },
          {
            taskId: "p1w1d7",
            title: "Study PR Guidelines",
            description: "Review Pull Request guidelines and study merged PRs",
            estimatedHours: 1.5,
            deliverable: "Notes on PR best practices, fork Jenkins repo",
            resources: ["https://github.com/jenkinsci/.github/blob/master/CONTRIBUTING.md"]
          }
        ]
      },
      "Week 2": {
        title: "Plugin System + First Issue",
        goal: "Understand plugins deeply, pick first issue",
        days: [
          {
            taskId: "p1w2d1",
            title: "Plugin Tutorial Deep Dive",
            description: "Learn about Jenkins plugin system and extension points",
            estimatedHours: 1.5,
            deliverable: "List 5 common extension points",
            resources: [
              "https://www.jenkins.io/doc/developer/tutorial/",
              "https://www.jenkins.io/doc/developer/extensions/"
            ]
          },
          {
            taskId: "p1w2d2",
            title: "Create Sample Plugin",
            description: "Create your first sample plugin using Maven archetype",
            estimatedHours: 1.5,
            deliverable: "Screenshot of running plugin",
            resources: []
          },
          {
            taskId: "p1w2d3",
            title: "Study Popular Plugins",
            description: "Star and analyze 5 popular plugin repos",
            estimatedHours: 1.5,
            deliverable: "Notes comparing plugin structures",
            resources: ["https://github.com/jenkinsci"]
          },
          {
            taskId: "p1w2d4",
            title: "Jenkinsfile Deep Dive",
            description: "Learn Pipeline as Code, create simple Jenkinsfile",
            estimatedHours: 1.5,
            deliverable: "Working pipeline screenshot",
            resources: ["https://www.jenkins.io/doc/book/pipeline/"]
          },
          {
            taskId: "p1w2d5",
            title: "Claim First Issue",
            description: "Pick your first issue from bookmarked list",
            estimatedHours: 1.5,
            deliverable: "Claimed issue + comment on JIRA",
            resources: []
          },
          {
            taskId: "p1w2d6",
            title: "Fix First Issue",
            description: "Study code, create branch, make changes locally",
            estimatedHours: 1.5,
            deliverable: "Working fix on local branch",
            resources: []
          },
          {
            taskId: "p1w2d7",
            title: "Write Tests & Commit",
            description: "Write/update tests, run tests locally, commit",
            estimatedHours: 1.5,
            deliverable: "Committed and pushed to fork",
            resources: []
          }
        ]
      },
      "Week 3": {
        title: "First PR + Review Cycle",
        goal: "Submit first PR, learn review process",
        days: [
          {
            taskId: "p1w3d1",
            title: "Submit First PR",
            description: "Create Pull Request with proper description",
            estimatedHours: 1.5,
            deliverable: "First PR submitted! 🎉",
            resources: []
          },
          {
            taskId: "p1w3d2",
            title: "Community Engagement",
            description: "Study other PRs, leave helpful comments",
            estimatedHours: 1.5,
            deliverable: "2-3 PR comments on beginner PRs",
            resources: []
          },
          {
            taskId: "p1w3d3",
            title: "Address PR Feedback",
            description: "Respond to review comments, push updates",
            estimatedHours: 1.5,
            deliverable: "Updated PR based on feedback",
            resources: []
          },
          {
            taskId: "p1w3d4",
            title: "Find Second Issue",
            description: "Browse plugin repos for slightly harder issue",
            estimatedHours: 1.5,
            deliverable: "Shortlist for issue #2",
            resources: []
          },
          {
            taskId: "p1w3d5",
            title: "Learn Testing Framework",
            description: "Study JenkinsRule and testing best practices",
            estimatedHours: 1.5,
            deliverable: "Notes on testing best practices",
            resources: ["https://www.jenkins.io/doc/developer/testing/"]
          },
          {
            taskId: "p1w3d6",
            title: "Start Second Issue",
            description: "Claim and start working on issue #2",
            estimatedHours: 1.5,
            deliverable: "Work in progress on issue #2",
            resources: []
          },
          {
            taskId: "p1w3d7",
            title: "Draft Solution",
            description: "Continue working on issue #2, focus on tests",
            estimatedHours: 1.5,
            deliverable: "Draft solution ready",
            resources: []
          }
        ]
      },
      "Week 4": {
        title: "Second PR + Plugin Exploration",
        goal: "Merge second PR, explore plugin development deeply",
        days: [
          {
            taskId: "p1w4d1",
            title: "Finalize Issue #2",
            description: "Complete fix with comprehensive tests",
            estimatedHours: 1.5,
            deliverable: "Issue #2 ready for PR",
            resources: []
          },
          {
            taskId: "p1w4d2",
            title: "Submit PR #2",
            description: "Create second pull request",
            estimatedHours: 1.5,
            deliverable: "PR #2 submitted",
            resources: []
          },
          {
            taskId: "p1w4d3",
            title: "Address PR #2 Reviews",
            description: "Respond to feedback on second PR",
            estimatedHours: 1.5,
            deliverable: "PR #2 updated",
            resources: []
          },
          {
            taskId: "p1w4d4",
            title: "Deep Dive Plugin Analysis",
            description: "Choose a plugin to contribute to, read entire codebase",
            estimatedHours: 1.5,
            deliverable: "Plugin analysis document",
            resources: []
          },
          {
            taskId: "p1w4d5",
            title: "Run Plugin Locally",
            description: "Clone, build, and run plugin locally",
            estimatedHours: 1.5,
            deliverable: "Working plugin locally",
            resources: []
          },
          {
            taskId: "p1w4d6",
            title: "Find Plugin Improvement",
            description: "Identify area for improvement in plugin",
            estimatedHours: 1.5,
            deliverable: "Feature/improvement idea documented",
            resources: []
          },
          {
            taskId: "p1w4d7",
            title: "Start Plugin Feature",
            description: "Design approach and start coding plugin feature",
            estimatedHours: 1.5,
            deliverable: "Feature branch with initial code",
            resources: []
          }
        ]
      },
      "Week 5": {
        title: "First Month Reflection",
        goal: "Document journey, plan ahead",
        days: [
          {
            taskId: "p1w5d1",
            title: "Complete Plugin Feature",
            description: "Finish plugin feature implementation",
            estimatedHours: 1.5,
            deliverable: "Feature complete",
            resources: []
          },
          {
            taskId: "p1w5d2",
            title: "Add Plugin Tests",
            description: "Write comprehensive tests for plugin feature",
            estimatedHours: 1.5,
            deliverable: "All tests passing",
            resources: []
          },
          {
            taskId: "p1w5d3",
            title: "Submit Plugin PR",
            description: "Create PR to plugin repository",
            estimatedHours: 1.5,
            deliverable: "Plugin PR submitted",
            resources: []
          },
          {
            taskId: "p1w5d4",
            title: "Write Blog Post",
            description: "Document your first month journey",
            estimatedHours: 1.5,
            deliverable: "Blog post draft",
            resources: []
          },
          {
            taskId: "p1w5d5",
            title: "Publish Blog",
            description: "Publish blog on LinkedIn/Dev.to",
            estimatedHours: 1.5,
            deliverable: "Published blog post 📝",
            resources: []
          },
          {
            taskId: "p1w5d6",
            title: "Update GitHub Profile",
            description: "Update profile README with contributions",
            estimatedHours: 1.5,
            deliverable: "Updated profile",
            resources: []
          },
          {
            taskId: "p1w5d7",
            title: "Plan December Goals",
            description: "Review progress and set next month's goals",
            estimatedHours: 1.5,
            deliverable: "December goals documented",
            resources: []
          }
        ]
      }
    }
  },
  "Phase 2": {
    title: "Plugin Development",
    duration: "Nov 16 - Dec 31",
    focus: "Intermediate Plugin Work",
    outcome: "2-3 intermediate PRs",
    weeks: {
      "Week 6": {
        title: "Extension Points Mastery",
        goal: "Understand extension points deeply",
        days: [
          {
            taskId: "p2w6d1",
            title: "Study Extension Points",
            description: "Deep dive into Jenkins extension point architecture",
            estimatedHours: 1.5,
            deliverable: "Extension point documentation notes",
            resources: ["https://www.jenkins.io/doc/developer/extensions/"]
          },
          {
            taskId: "p2w6d2",
            title: "Create Custom Extension Point",
            description: "Try creating your own custom extension point",
            estimatedHours: 1.5,
            deliverable: "Custom extension point example",
            resources: []
          },
          {
            taskId: "p2w6d3",
            title: "Explore JCasC Plugin",
            description: "Study Jenkins Configuration as Code plugin",
            estimatedHours: 1.5,
            deliverable: "JCasC understanding notes",
            resources: ["https://github.com/jenkinsci/configuration-as-code-plugin"]
          },
          {
            taskId: "p2w6d4",
            title: "Create JCasC Configuration",
            description: "Create sample configuration using JCasC",
            estimatedHours: 1.5,
            deliverable: "Working JCasC example",
            resources: []
          },
          {
            taskId: "p2w6d5",
            title: "Test Configuration Loading",
            description: "Test JCasC configuration in local Jenkins",
            estimatedHours: 1.5,
            deliverable: "Tested configuration",
            resources: []
          },
          {
            taskId: "p2w6d6",
            title: "Community Engagement",
            description: "Help newcomers in Gitter, review PRs",
            estimatedHours: 1.5,
            deliverable: "Community interactions",
            resources: []
          },
          {
            taskId: "p2w6d7",
            title: "Attend Office Hours",
            description: "Attend Jenkins office hours if available",
            estimatedHours: 1.5,
            deliverable: "Office hours attendance",
            resources: []
          }
        ]
      },
      // Continue with remaining weeks...
      "Week 7": {
        title: "Core Jenkins Contribution",
        goal: "Start working on Jenkins core",
        days: [
          {
            taskId: "p2w7d1",
            title: "Find Core Issue",
            description: "Pick medium-complexity issue in Jenkins core",
            estimatedHours: 1.5,
            deliverable: "Core issue claimed",
            resources: []
          },
          {
            taskId: "p2w7d2",
            title: "Study Related Code",
            description: "Thoroughly study code related to core issue",
            estimatedHours: 1.5,
            deliverable: "Code analysis complete",
            resources: []
          },
          {
            taskId: "p2w7d3",
            title: "Implement Core Fix",
            description: "Implement fix for core Jenkins issue",
            estimatedHours: 1.5,
            deliverable: "Fix implemented",
            resources: []
          },
          {
            taskId: "p2w7d4",
            title: "Write Core Tests",
            description: "Add comprehensive tests for core fix",
            estimatedHours: 1.5,
            deliverable: "Tests complete",
            resources: []
          },
          {
            taskId: "p2w7d5",
            title: "Document Core PR",
            description: "Document approach and create PR",
            estimatedHours: 1.5,
            deliverable: "Core Jenkins PR submitted",
            resources: []
          },
          {
            taskId: "p2w7d6",
            title: "Address Core PR Reviews",
            description: "Respond to feedback on core PR",
            estimatedHours: 1.5,
            deliverable: "PR updated",
            resources: []
          },
          {
            taskId: "p2w7d7",
            title: "Week Review",
            description: "Review week's progress and plan ahead",
            estimatedHours: 1.5,
            deliverable: "Weekly reflection",
            resources: []
          }
        ]
      }
      // Add more weeks following the same pattern...
    }
  },
  "Phase 3": {
    title: "CI/CD Mastery",
    duration: "Jan 1 - Feb 15",
    focus: "Pipeline Mastery + Docker",
    outcome: "Portfolio projects",
    weeks: {
      "Week 12": {
        title: "Advanced Pipelines",
        goal: "Master complex pipeline patterns",
        days: [
          {
            taskId: "p3w12d1",
            title: "Declarative vs Scripted",
            description: "Deep dive into both pipeline types",
            estimatedHours: 1.5,
            deliverable: "Comparison notes",
            resources: []
          },
          // Add remaining days...
        ]
      }
      // Add remaining weeks...
    }
  },
  "Phase 4": {
    title: "GSoC Prep + Recognition",
    duration: "Feb 16 - Mar 31",
    focus: "Proposal + Visibility",
    outcome: "Community recognition",
    weeks: {
      "Week 19": {
        title: "GSoC Proposal Draft",
        goal: "Craft excellent proposal",
        days: [
          {
            taskId: "p4w19d1",
            title: "Study GSoC Ideas",
            description: "Review Jenkins GSoC 2026 ideas list",
            estimatedHours: 1.5,
            deliverable: "Project ideas shortlist",
            resources: []
          },
          // Add remaining days...
        ]
      }
      // Add remaining weeks...
    }
  }
};