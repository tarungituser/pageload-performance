pipeline {
    agent { label 'jenkins_master' }

environment {
        ELASTICINDEX = 'monotype_live/perf_metrics'
        REPORTPATH = 'C:\\Projects\\MonotypeLivePageLoadPerfReports\\'
        REPORTDISPLAYPATH = '\\NOI-TARUNK-W10\\MonotypeLivePageLoadPerfReports\\'
    }

    stages {
        stage('Setup') {
            steps {
                bat label: '', script: 'npm update'
                 bat label: '', script: 'npm install'
                 bat label: '', script: 'npm run preprotractor'
            }
        }
        stage('Performance Tests - Mobile') {
            steps {
           catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            bat '''
                setlocal 
                    set DEVICE=mobile
                    set THROTTLINGMETHOD=simulate
                    npm run perftest
                endlocal    
               '''
             echo "Stage Mobile Failed as tcs failure rate greater then 0 percentile"
                }
            }
        }

        stage('Performance Tests - Desktop') {
           
            steps {
            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
             bat '''
                setlocal 
                    set DEVICE=desktop
                    set THROTTLINGMETHOD=provided
                    npm run perftest
                endlocal    
               '''
                echo "Stage Desktop Failed as tcs failure rate greater then 0 percentile"
                }            
            }
        }
    }

    post {
        always { 
            allure([
	        includeProperties: false,
        	jdk: '',
        	reportBuildPolicy: 'ALWAYS',
        	results: [[path: 'allure-results']]
            ])
            emailext body: '''${SCRIPT, template="allure-report.groovy"}''',
                        subject: "[Jenkins] Monotype Live Page Load Performance Execution Summary",
                        to: '${ENV, var="MAIL_TO"}'
        }
    }
}