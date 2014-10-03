load 'deploy' if respond_to?(:namespace)

set :application, 'charts'
set :repository, 'git@github.com:nazar/sound-charts-api.git'
set :scm, :git
set :deploy_via, :remote_cache
set :group, 'www-data'
set :use_sudo, false

set :keep_releases, 5

default_run_options[:pty] = true

desc "Run tasks in production environment."
task :production do
  domain = '176.58.125.89'

  role :app, domain
  role :web, domain
  role :db, domain, :primary => true

  set :user, 'nazar'

  set :branch, 'master'
  set :deploy_to, "/var/www/charts.charb.it/api"
end

namespace :deploy do

  task :restart do
    production_configs
    node_modules
    depend
    touch_restart
  end

  #copy production configs to application folder
  task :production_configs do
    run "cp #{File.join(shared_path, 'res', 'knexfile.js')} #{File.join(current_release, 'knexfile.js')}"
    run "cp #{File.join(shared_path, 'res', 'production.json')} #{File.join(current_release, 'config', 'production.json')}"
  end

  #link shared/node_modules to current directory - saves downloading all nodejs modules on deploy
  task :node_modules do
    run "ln -s #{File.join(shared_path, 'node_modules')} #{File.join(current_release, 'node_modules')}"
  end

  task :depend do
    run "cd #{current_release} && npm install --production"
  end

  task :touch_restart do
    run "touch #{current_release}/tmp/restart.txt"
  end

end

after "deploy:update", "deploy:cleanup"