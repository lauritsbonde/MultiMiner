Vagrant.configure('2') do |config|

  require 'yaml'
  settings = YAML.load_file 'vagrantSettings.yaml'

  config.vm.define "droplet1" do |config|
    config.vm.network "public_network", ip: "164.92.179.95"
      config.vm.provider :digital_ocean do |provider, override|
        override.ssh.private_key_path = '~/.ssh/multiminer'
        override.vm.box = 'digital_ocean'
        override.vm.box_url = "https://github.com/devopsgroup-io/vagrant-digitalocean/raw/master/box/digital_ocean.box"
        override.nfs.functional = false
        override.vm.allowed_synced_folder_types = :rsync
        provider.token = settings['provider_token']
        provider.image = 'ubuntu-18-04-x64'
        provider.region = 'fra1' # Frankfurt - physical location
        provider.size = 's-2vcpu-4gb' # 2 vCPU, 4GB RAM - mssql needs 2gb ram
        provider.backups_enabled = false
        provider.private_networking = false
        provider.ipv6 = false
        provider.monitoring = false
      end


      config.vm.synced_folder ".", "/vagrant", disabled: true

      config.vagrant.plugins = "vagrant-docker-compose"
      # install docker and docker-compose
      config.vm.provision :docker
      config.vm.provision :docker_compose

      config.vm.provision "shell", inline: <<-SHELL
        echo "finished docker install"
      SHELL

      config.vm.provision "shell", env: {"MONGODB_PASSWORD" => settings['MONGODB_PASSWORD'],"NODE_ENV" => settings['NODE_ENV'],"REACT_APP_BACKEND_URL" => settings['REACT_APP_BACKEND_URL'],"REACT_APP_ENVIRONMENT" => settings['REACT_APP_ENVIRONMENT'],"BASEURL" => settings['BASEURL'], "provider_token" => settings['provider_token'], "RECORD_ID" => settings["RECORD_ID"]}, inline: <<-SHELL
        echo "installing doctl"
        cd ~
        wget https://github.com/digitalocean/doctl/releases/download/v1.92.0/doctl-1.92.0-linux-amd64.tar.gz
        tar xf ~/doctl-1.92.0-linux-amd64.tar.gz
        sudo mv ~/doctl /usr/local/bin
        echo "finished installing doctl"

        echo "token for doctl: $provider_token"

        echo "grant account access to doctl"
        doctl auth init -t $provider_token
        echo "finished granting account access to doctl"

        echo "assign reserved ip to droplet"
        dropletId="$(doctl compute droplet get droplet1 --template {{.ID}})"

        doctl compute reserved-ip-action assign 164.90.243.228 $dropletId

        echo "starting git clone"
        git clone https://github.com/lauritsbonde/MultiMiner.git
        echo "finished git clone"

        echo "starting docker-compose"
        cd MultiMiner

        # set the env variables
        # BACKEND
        echo "MONGODB_PASSWORD=$MONGODB_PASSWORD">> .env
        echo "NODE_ENV=$NODE_ENV">> .env

        # FRONTEND
        echo "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL">> .env
        echo "REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT">> .env

        # GLOBAL
        echo "BASEURL=$BASEURL">> .env
        echo "CERT_RESOLVER=production">> .env

        # set the env variables for frontend
        cd frontend
        echo "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL">> .env
        echo "REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT">> .env

        cd ..

        set the env variables for backend
        cd backend  
        echo "MONGODB_PASSWORD=$MONGODB_PASSWORD">> .env
        echo "NODE_ENV=$NODE_ENV">> .env

        cd ..

        docker-compose up -d --build
        echo "finished docker-compose"
      
      SHELL
  end
end
