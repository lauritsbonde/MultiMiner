Vagrant.configure('2') do |config|

  require 'yaml'
  settings = YAML.load_file 'vagrantSettings.yaml'

  config.vm.define "multiminerProduction", primary: true do |config|
    config.vm.network "public_network", ip: "164.92.179.01"
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


      config.vm.synced_folder "remote_files", "/multiminer", type: "rsync"
      config.vm.synced_folder '.', '/vagrant', disabled: true

      config.vm.provision "shell", inline: <<-SHELL
        echo "finished docker install"
      SHELL

      config.vm.provision "shell", inline: 'echo "export DOCKER_USERNAME=' + "'" + settings["DOCKER_USERNAME"] + "'" + '" >> ~/.bash_profile'
      config.vm.provision "shell", inline: 'echo "export DOCKER_PASSWORD=' + "'" + settings["DOCKER_PASSWORD"] + "'" + '" >> ~/.bash_profile'

      config.vm.provision "shell", env: {"BASEURL" => settings['BASEURL'], "provider_token" => settings['provider_token'], "MONGODB_USERNAME" => settings['MONGODB_USERNAME'], "MONGODB_PASSWORD" => settings["MONGODB_PASSWORD"]}, inline: <<-SHELL
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
        dropletId="$(doctl compute droplet get multiminerProduction --template {{.ID}})"

        doctl compute reserved-ip-action assign 164.90.243.228 $dropletId

        # set the env variables
        # GLOBAL
        cd /multiminer
        echo "BASEURL=$BASEURL">> .env
        echo "CERT_RESOLVER=production">> .env
        echo "MONGODB_USERNAME=$MONGODB_USERNAME">> .env
        echo "MONGODB_PASSWORD=$MONGODB_PASSWORD">> .env

        # Install docker and docker-compose
        sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
        apt-cache policy docker-ce
        sudo apt install -y docker-ce
        sudo systemctl status docker
        sudo usermod -aG docker ${USER}
        sudo apt install -y docker-compose
        

        # Install make
        sudo apt-get install -y make
        
        echo -e "\nVerifying that docker works ...\n"
        docker run --rm hello-world
        docker rmi hello-world

        echo -e "\nOpening port for multiminer ...\n"
        ufw allow 3000 && \
        ufw allow 22/tcp

        echo ". $HOME/.bashrc" >> $HOME/.bash_profile

        echo -e "\nConfiguring credentials as environment variables...\n"

        source $HOME/.bash_profile

        echo -e "\nSelecting multiminer Folder as default folder when you ssh into the server...\n"
        echo "cd /multiminer" >> ~/.bash_profile

        chmod +x /multiminer/deploy.sh

        echo -e "\nVagrant setup done ..."
        echo -e "multiminer will later be accessible at http://$(hostname -I | awk '{print $1}'):3000"
        echo -e "The mysql database needs a minute to initialize, if the landing page is stack-trace ..."
      
      SHELL
  end

  config.vm.define "multiminerStaging", autostart: false do |config|
    config.vm.network "public_network", ip: "164.92.179.99"
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


      config.vm.synced_folder "remote_files", "/multiminer", type: "rsync"
      config.vm.synced_folder '.', '/vagrant', disabled: true

      config.vm.provision "shell", inline: <<-SHELL
        echo "finished docker install"
      SHELL

      config.vm.provision "shell", inline: 'echo "export DOCKER_USERNAME=' + "'" + settings["DOCKER_USERNAME"] + "'" + '" >> ~/.bash_profile'
      config.vm.provision "shell", inline: 'echo "export DOCKER_PASSWORD=' + "'" + settings["DOCKER_PASSWORD"] + "'" + '" >> ~/.bash_profile'

      config.vm.provision "shell", env: {"BASEURL" => settings['BASEURL'], "provider_token" => settings['provider_token'], "MONGODB_USERNAME" => settings['MONGODB_USERNAME'], "MONGODB_PASSWORD" => settings["MONGODB_PASSWORD"]}, inline: <<-SHELL
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
        dropletId="$(doctl compute droplet get multiminerStaging --template {{.ID}})"

        doctl compute reserved-ip-action assign 188.166.192.104 $dropletId

        # set the env variables
        # GLOBAL
        cd /multiminer
        echo "BASEURL=$BASEURL">> .env
        echo "CERT_RESOLVER=production">> .env
        echo "MONGODB_USERNAME=$MONGODB_USERNAME">> .env
        echo "MONGODB_PASSWORD=$MONGODB_PASSWORD">> .env

        # Install docker and docker-compose
        sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
        apt-cache policy docker-ce
        sudo apt install -y docker-ce
        sudo systemctl status docker
        sudo usermod -aG docker ${USER}
        sudo apt install -y docker-compose
        

        # Install make
        sudo apt-get install -y make
        
        echo -e "\nVerifying that docker works ...\n"
        docker run --rm hello-world
        docker rmi hello-world

        echo -e "\nOpening port for multiminer ...\n"
        ufw allow 3000 && \
        ufw allow 22/tcp

        echo ". $HOME/.bashrc" >> $HOME/.bash_profile

        echo -e "\nConfiguring credentials as environment variables...\n"

        source $HOME/.bash_profile

        echo -e "\nSelecting multiminer Folder as default folder when you ssh into the server...\n"
        echo "cd /multiminer" >> ~/.bash_profile

        chmod +x /multiminer/deploy.sh

        echo -e "\nVagrant setup done ..."
        echo -e "multiminer will later be accessible at http://$(hostname -I | awk '{print $1}'):3000"
        echo -e "The mysql database needs a minute to initialize, if the landing page is stack-trace ..."
      
      SHELL
  end
end
