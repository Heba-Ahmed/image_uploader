/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var passport = require('passport');

module.exports = {
	
    login: function(req, res) {
		
		//console.log('trying to authenticaaaaaaaaaaaate ');

        passport.authenticate('local', function(err, user, info) {
			
            if ((err) || (!user)) {
                console.log("Not Logged in !") ;
				req.session.user = null ;
				
				req.flash('fm', {
					type: "error",
					message: 'Could not login , error: '+info.message
				});
				res.redirect('/Index/home_page') ;	
				
            } else {
				console.log("Logged in !") ;
				req.session.user = user ;			
				res.redirect('/Index/user_images') ;	
			}
			
        })(req, res);
    },

    logout: function(req, res) {
        
        req.session.user = null;
        res.redirect('/');
    } ,
    
    signup : function(req , res ){
		if( req.param('email') ){
			User.findOne({email : req.param('email')}).exec(function(err , result){
				
				if(result) {
					req.flash('fm', {
					type: "error",
						message: 'Could not add user , error: this email is exists'
					});
					res.redirect('/User/signup')
				} else {
					User.create({email:req.param('email') , password:req.param('password')}).exec(function(err , user){
						if(!err) {
							req.flash('fm', {
								type: "success",
								message: '  User added successfully'
							});
							res.redirect('/')
						}
						else {
							req.flash('fm', {
							type: "error",
								message: 'Could not add user , error: '+ err
							});
							res.redirect('/User/signup')
						}	
					});
				}
			});
		} else {
			res.view();
		}
		
	}

};

