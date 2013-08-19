# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'simple_feedback_js/version'

Gem::Specification.new do |spec|
  spec.name          = "simple_feedback_js"
  spec.version       = SimpleFeedbackJs::VERSION
  spec.authors       = ["ahardstylec"]
  spec.email         = ["andreas.collmann@gmail.com"]
  spec.description   = %q{Simple Feedback js - Tiny Feedback library}
  spec.summary       = %q{Simple Feedback is a tiny libraray that helps you to create feedback of your website. When imported you can link the feedback process. 
                          It goes through an feedback process to create a screenshot of the current page, makes commentary and rates the Website. Furthermore it sends this feedback to an central Server where Developers can Answer to it or review it to make this website more useful for the User.}
  spec.homepage      = "https://github.com/ahardstylec/simple_feedback_js"
  spec.license       = "MIT"

  spec.files         = Dir["{lib,vendor}/**/*"] + ["MIT-LICENSE", "README.md"]
  spec.require_paths = ["lib"]
  spec.add_dependency("railties", "~> 3.1")
  spec.add_dependency("jquery-rails")

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
end
