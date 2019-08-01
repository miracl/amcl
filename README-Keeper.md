# Keeper fork of AMCL: Apache Milagro Cryptographic Library

AMCL is a cryptographic math library that we use in the login process for all clients, including Java, JavaScript, and Swift-based clients.
It is also used on the server side in KeeperApp.

We have forked this project in order to maintain control over code updates.

## Usage
We have created the `keeper` branch from the master branch.  We will probably branch off of that for actual projects.  For example:
```
[Keeper AMCL fork]
  master                               -- synchronized with the actual AMCL code
    keeper                             -- our base branch
      release_1.0.0                    -- a version used by some clients
      release_2.0.0                    -- a version used by some clients
```

See the https://github.com/Keeper-Security/keeper-pythia-client project for the actual library versions you should use.

To pull changes from our `master` branch into our `keeper` branch, run:
```
$ git checkout master
$ git pull
$ git checkout keeper
$ git merge master
$ git push
```  

## Updating
The `master` branch is updated by the main AMCL developers.  To pull changes into our master branch, first checkout our fork (this project).
Then, on your machine, run:

```
$ git pull https://github.com/miracl/amcl master
```

After resolving any merge conflicts push the changes to the master branch of our fork.

```
$ git push
```


