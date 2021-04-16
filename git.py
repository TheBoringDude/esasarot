import os
import subprocess

if __name__ == "__main__":
    # enter commit message
    commit = input("Enter Commit Message :#  ")

    # get the current branch
    branch = subprocess.check_output(
        ["git", "branch", "--show-current"], encoding="UTF-8"
    ).strip()

    # run commands
    os.system("git add .")
    os.system(f'git commit -m "{commit}"')
    os.system(f'git push -u origin {branch}')