import os
import sys
import shutil
import click
import subprocess

tmp_base_folder = "./tmp_versions"
shaka_git = "https://github.com/google/shaka-player"

def execute_cmd(cmd):
    # proc = subprocess.Popen(cmd, shell=True)
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    (out, err) = proc.communicate()
    out = out.decode()

    if(err):
        print(err)
        print(out)
        sys.exit()
    return out, err

def download_version(version):
    if(version == "local"):
        tmp_folder = os.path.join(".")
    else:
        tmp_folder = os.path.join(tmp_base_folder, version)

    build_folder = os.path.join(tmp_folder, "dist")

    # create base folder if needed
    if not os.path.exists(tmp_base_folder):
        print(f"creating base tmp folder: '{tmp_base_folder}'")
        os.makedirs(tmp_base_folder)

    # clone the version if dont exist yet
    if not os.path.exists(tmp_folder):
        tag_name = f"v{version}"
        command = f"git clone --depth 1 --branch {tag_name} {shaka_git} {tmp_folder}"
        print(f"cloning version {version} in: '{tmp_folder}'")
        execute_cmd(command)
    else: print("No need to clone")

    if (not os.path.exists(build_folder)) or version == "local":
        print(f"building shaka at: {build_folder}")
        execute_cmd(f"cd {tmp_folder} && python3 build/all.py")
    else: print("No need to build")

    print("copy files")
    origin = os.path.join(build_folder, "shaka-player.compiled.debug.js")
    destination = "/home/mdidier/Prog/shaka-player/tmp/dist/shaka-player.js"
    print(f"origin: '{origin}', destination: '{destination}'")

    if os.path.exists(destination):
        os.remove(destination)
    shutil.copyfile(origin, destination)



@click.command()
@click.argument('version', type=click.STRING, metavar='<version>')
def cli(version):
    print('get_shaka_version: {}'.format(version))
    download_version(version)


if(__name__=="__main__"):
    cli()