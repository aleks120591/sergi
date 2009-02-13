var Direction = {
	Ortos : [[1, 0], [0, -1], [-1, 0], [0, 1]],
	getRandomDirection : function(vector, rnd)
	{
		rnd = rnd % 256;
		
		var s=0, d = this.Ortos[0];
		for(var q=0;q<4;q++)
		{
			var z = Math.sin(Math.PI*(64*q+vector)/128);
			if (z<0) z = 0;
			s += 256*z*z;
			if (s > rnd)
			{
				d = this.Ortos[q];
				break;
			}
		}
		
		return d;
	}
}