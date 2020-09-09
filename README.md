# todoList
Write a ToDo web application without a server.
 
The Application should provide the following functionality:
* Add a task with title
* Task list is sorted in reverse order by the task title
* Edit a task
* Mark a task as completed
* Remove a task
* Persist tasks between working sessions (it could be LocalStorage)
Note: it is ok for a "customer" if you do something quickly and provide additional features, but there will be no penalties if you don't.
 
Business context:
* Goal is the time to market
* Be ready to change something minor fast in the future
 
Non-Functional Requirements:
* Test task should be presented as a git repository with a history of changes. it could be located on GitHub (preferred) or folder with .git metadata.
* Application should be written on JavaScript, frameworks are up to developer.
* This task should take no more than 6-8 working hours(it is better to be less).

For Edit task just click on a title 

Example: https://jsfiddle.net/sabaking/q1d98wgu/1/

Possible problems:
1) localStorage have size limit (10 MB per origin in Google) see in code fn syncTasksToLocalStorage()
2) more then 500 tasks - rendering perfomance problem (mb slow) see in code  fn renderTasks()
