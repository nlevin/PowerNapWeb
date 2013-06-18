import os
import pipes

def postBuild(site):
    os.system(
        'sass -t compressed --update %s/static/css/style.sass' % 
            pipes.quote(site.paths['build']
    ))
