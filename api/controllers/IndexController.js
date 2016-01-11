/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	home_page :function(req,res,next){
		res.view({ system_title: "Image Uploader"});
	},
	
	user_images : function(req , res , next){
		// fetch all images uploaded by current user.
		// send them back to the view i.e. res.view ({ images : [] })
		Uploaded_images.find({user_id : req.session.user.id}).exec(function(err , images){
			//console.log(images);
			res.view({images:images});
		});
		
	},
	
	diplay_image : function(req , res , next){
		var image = req.param('image');
		res.view({ image : image});
	} ,
	
	upload: function (req, res) {
		var uploadFile = req.file('uploadFile');
		//console.log(uploadFile);

		uploadFile.upload({ dirname: '../../assets/images'},function onUploadComplete (err, files) {
			// Files will be uploaded to /assets/images/
			// Access the files via localhost:1337/images/yourfilename
			console.log(files);
			if (err) {
				req.flash('fm', {
					type: "error",
					message: 'Could not upload image , error: '+err
				});
				res.redirect('/Index/user_images');
				
			}else{
				var title = req.param('title');
				var description = req.param('description');
				
				Uploaded_images.create({
					user_id:req.session.user.id , 
					// save name of the image only
					path: files[0].fd.split('/')[files[0].fd.split('/').length-1]  , 
					title: title ,
					description:description 
				}).exec(function(err , results){
					console.log(err , results);
					
					if(!err){
						req.flash('fm', {
							type: "success",
							message: 'Sucessfully upload image '
						});
					}else{
						req.flash('fm', {
							type: "danger",
							message: 'Error upload image '
						});
					}
					res.redirect('/Index/user_images');
				});
		
			}
		});
	} ,

	delete_selected_images: function(req , res , next){
		var ids = JSON.parse(req.param('images_ids') );
		
		Uploaded_images.destroy({id:ids})
			.exec(function(err, action) {
				if(err)
				req.flash('fm', {
					type: "danger",
					message: 'Could not delete image(s) , error: '+err
				});
				
				else 
				
				req.flash('fm', {
					type: "success",
					message: 'Succefully deleted '+ ids.length+' image(s)'
				});
				
				res.redirect('/Index/user_images');
			});
			
		
	}
};

