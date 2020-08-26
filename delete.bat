del /q "C:\Backup\Dev\Projects\GreenWerx\node_modules\*"
FOR /D %%p IN ("C:\Backup\Dev\Projects\GreenWerx\node_modules\*.*") DO rmdir "%%p" /s /q