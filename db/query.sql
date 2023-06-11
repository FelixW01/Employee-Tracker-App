
SELECT 
    role.id,
    role.title,
    role.salary,
    department.name AS department
 FROM role LEFT JOIN department 
 ON department.id = role.department_id;