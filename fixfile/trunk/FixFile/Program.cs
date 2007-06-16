using System;
using System.IO;

namespace FixFile
{
    class Program
    {
        static void Main(string[] args)
        {
            const int blockSize = 4096;
            
            if (args.Length<2)
            {
                ShowUsage();
                return;
            }

            FileStream stream1 = File.OpenRead(args[0]);
            FileStream stream2 = new FileStream(args[1], FileMode.Open, FileAccess.ReadWrite);
            
            int fileSize = (int)stream1.Length;
            if (fileSize != stream2.Length)
            {
                Console.WriteLine("File sizes differ.");
                ShowUsage();
            }

            int badBlocks = 0; 
            using (BinaryReader reader1 = new BinaryReader(stream1))
            {
                using (BinaryReader reader2 = new BinaryReader(stream2))
                {
                    int p = 0;
                    int perc = 0;
                    byte[] block;
                    do
                    {
                        int cur = (int)(((long)100 * p) / fileSize);
                        if (cur>perc)
                        {
                            perc = cur;
                            Console.WriteLine(perc.ToString()+"%");
                        }
                        block = reader1.ReadBytes(blockSize);
                        byte[] dest = reader2.ReadBytes(blockSize);
                        if (!Match(block, dest))
                        {
                            stream2.Seek(p, SeekOrigin.Begin);
                            stream2.Write(block, 0, block.Length);
                            badBlocks++;
                        }
                        p += blockSize;
                    } while (block.Length == blockSize);
                }
            }
            
            stream1.Close();
            stream2.Close();
            Console.WriteLine(String.Format("Finished. {0} blocks fixed", badBlocks));
            Console.ReadLine();
        }

        static private void ShowUsage()
        {
            Console.WriteLine("Usage: FixFile firstfile secondfile");
        }

        static private bool Match(byte[] block1, byte[] block2)
        {
            if (block1.Length != block2.Length)
            {
                return false;
            }
            for(int i=0;i<block1.Length;i++)
            {
                if (block1[i]!=block2[i]) return false;
            }
            return true;
        }
    }
}
